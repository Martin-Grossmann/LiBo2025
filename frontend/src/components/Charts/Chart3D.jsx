import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle, useCallback, useMemo } from "react";
import HelpWindows from "../HelpWindows/HelpWindows3D";
import Globe from "react-globe.gl";
import "./Chart3D.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchPoints, fetchPointsByYear } from "../../store/actions/pointsActions3D"; // Supprimer setYearFilter
import shipSVG from "../../assets/shipSVG.svg";
import backgroundMusic from "../../assets/Conquest_of_Paradise Angelis.mp3";
import DisableScrollZoom from "../../utilities/DisableScrollZoom";
import YearFilter3D from "../Filters/YearFilter3D";
import SoloFilter3D from "../Filters/SoloFilter3D";




const Chart3D = forwardRef(({ onBack, mapConfig }, ref) => {
    // Stocke tous les points (All) pour séparer l'animation solo
    const [allPoints, setAllPoints] = useState([]);
    const globeRef = useRef();
    const audioRef = useRef(null);
    const [countries, setCountries] = useState([]);
    const [visiblePoints, setVisiblePoints] = useState([]);
    const [animationSpeed, setAnimationSpeed] = useState(1000);
    // plus utilisé: isInitialized
    const [lastPoint, setLastPoint] = useState(null);
    const [isfilterButton, setIsFilterButton] = useState("");
    const [selectedYear, setSelectedYear] = useState("All");
    const animationTimersRef = useRef([]);
    const animatePointsRef = useRef(null);
    const [isAnimating, setIsAnimating] = useState(false);
    const animationStateRef = useRef({
        currentIndex: 0,
        pausedAtIndex: 0,
        isComplete: false
    });
    const [specialEvent, setSpecialEvent] = useState(null);
    const specialEventTimerRef = useRef(null);
    const dispatch = useDispatch();

    const [autoStartAnimation, setAutoStartAnimation] = useState(true);
    const [soloOnly, setSoloOnly] = useState(false);

    React.useEffect(() => {
        if (window.electronZoom) {

        }
    }, []);

    // Fonction pour gérer le changement du checkBox solo
    const handleSoloChange = (checked) => {
        setSoloOnly(checked);
        if (checked) {
            if (selectedYear !== 'All' && selectedYear !== 'all') {
                setSelectedYear('All');
            }
            dispatch(fetchPoints());
        }
    };
    // État pour la fenêtre d'aide
    const [showHelpWindow, setShowHelpWindow] = useState(false);


    // Fonction pour gérer le changement d'année
    const handleYearChange = (year) => {
        setAutoStartAnimation(true); // Toujours en premier
        setSelectedYear(year);
        setSoloOnly(false); // décocher soloOnly si on change d'année
        if (year === "All" || year === "all") {
            dispatch(fetchPoints());
        } else {
            dispatch(fetchPointsByYear(year));
        }
        setTimeout(() => { }, 100);
    };

    // Quand soloOnly est activé, forcer année à All et recharger tous les points

    // SUPPRIME les useEffect soloOnly pour éviter toute boucle

    // Initialize and play background music when component mounts
    useEffect(() => {
        audioRef.current = new Audio(backgroundMusic);
        audioRef.current.loop = true;
        audioRef.current.volume = 0.5;

        const playPromise = audioRef.current.play();

        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.warn("Audio autoplay was prevented:", error);
            });
        }

        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
                audioRef.current = null;
            }
        };
    }, []);

    // Palette de couleurs pour les différentes années
    const colorPalette = useMemo(() => [
        "#FFFF00", // 1997 
        "#FF8000", // 1998 
        "#FF0000", // 1999 
        "#7ad60a", // 2000
        "#FE2E64", // 2001 
        "#6248e5", // 2002 
        "#31B404", // 2003 
        "#FE2E64", // 2004 
        "#FF8000", // 2005 
        "#6248e5", // 2006 
        "#FFFF00", // 2007 
        "#04B404", // 2008 
        "#FF0000", // 2012 
    ], []);

    const yearColorMap = {
        1997: "#FFFF00",
        1998: "#FF8000",
        1999: "#FF0000",
        2000: "#7ad60a",
        2001: "#FE2E64",
        2002: "#6248e5",
        2003: "#31B404",
        2004: "#FE2E64",
        2005: "#FF8000",
        2006: "#6248e5",
        2007: "#FFFF00",
        2008: "#04B404",
        2012: "#FF0000"
    };

    // Récupérer les points depuis le Redux store (points3D)
    const points3DState = useSelector(state => state.points3D || {});
    const { items = [], error = null } = points3DState;
    const points = items;

    // Met à jour allPoints uniquement lors du fetch "All"
    useEffect(() => {
        if (selectedYear === "All" || selectedYear === "all") {
            setAllPoints(items);
        }
    }, [items, selectedYear]);


    // Filtrage combiné année + solo
    const filteredPoints = useMemo(() => {
        let pts = points;
        if (selectedYear !== "All" && selectedYear !== "all") {
            pts = pts.filter(point => String(point.year) === String(selectedYear));
        }
        // Ne filtre plus pour soloOnly ici !
        return pts;
    }, [points, selectedYear, soloOnly]);


    // Met à jour les points visibles sur le globe
    useEffect(() => {
        setVisiblePoints(filteredPoints);
    }, [filteredPoints]);

    // Nettoyer les timers d'animation
    const clearAnimationTimers = useCallback(() => {
        animationTimersRef.current.forEach(timer => clearTimeout(timer));
        animationTimersRef.current = [];
    }, []);

    // Nettoyer le timer d'événement spécial
    const clearSpecialEventTimer = useCallback(() => {
        if (specialEventTimerRef.current) {
            clearTimeout(specialEventTimerRef.current);
            specialEventTimerRef.current = null;
        }
    }, []);

    // Transformer les points de l'API en format compatible avec le globe
    const journeyAllPoints = allPoints
        .map(point => {
            let dateObj;
            try {
                dateObj = new Date(point.date);
                if (isNaN(dateObj.getTime())) {
                    throw new Error('Invalid date');
                }
            } catch (error) {
                // Log pour debug
                console.warn('Invalid date in allPoints:', point);
                return null;
            }
            let year = dateObj.getFullYear();
            if (typeof year !== 'number' || isNaN(year)) return null;
            year = String(year);
            return {
                ...point,
                lat: point.lat,
                lng: point.long,
                label: point.name || point.description || "Point",
                date: dateObj.toISOString().split('T')[0],
                year: year
            };
        })
        .filter(Boolean);
    const journeyPoints = points
        .map(point => {
            let dateObj;
            try {
                dateObj = new Date(point.date);
                if (isNaN(dateObj.getTime())) {
                    throw new Error('Invalid date');
                }
            } catch (error) {
                console.warn('Invalid date in points:', point);
                return null;
            }
            let year = dateObj.getFullYear();
            if (typeof year !== 'number' || isNaN(year)) return null;
            year = String(year);
            return {
                ...point,
                lat: point.lat,
                lng: point.long,
                label: point.name || point.description || "Point",
                date: dateObj.toISOString().split('T')[0],
                year: year
            };
        })
        .filter(Boolean);

    // Obtenir les années uniques pour le filtre
    const availableYears = useMemo(() => {
        // On ne garde que les années primitives (string ou number)
        const years = [...new Set(journeyPoints
            .map(point => point.year)
            .filter(year => typeof year === 'string' || typeof year === 'number'))]
            .filter(year => year && year !== String(new Date().getFullYear()))
            .sort();
        return ["All", ...years];
    }, [journeyPoints]);


    // Fonction pour vérifier les événements spéciaux
    const checkSpecialEvents = useCallback((point) => {
        if (point.entry_id === 273) {
            return { message: "Premier passage du Canal de Panama !" };
        }

        if (point.entry_id === 481) {
            return { message: "TSUNAMI !" };
        }

        if (point.entry_id === 549) {
            return { message: "Passage du Cap de Bonne Espérance !" };
        }

        if (point.entry_id === 558) {
            return { message: "Passage du du Médidien Greenwech 0° " };
        }

        if (point.entry_id === 597) {
            return { message: "Fin d'un tour du monde! Et LA TERRE EST RONDE!" };
        }

        if (point.entry_id === 646) {
            return { message: "Deuxième passage du Canal de Panama !" };
        }

        if (Math.abs(point.lat) < 0.5) {
            return { message: "Passage de l'Equateur !" };
        }

        if (Math.abs(Math.abs(point.lng) - 180) < 0.5) {
            return { message: "Passage de l'Antiméridien (ligne de changement de la date) !" };
        }

        if (point.entry_id === 713) {
            return {
                message: "Merci à vous les 3 Océans de nous avoir laissé passer sans trop de galères. Et surtout merci à toi mon pote Hakuna Mata pour ta fidélité !",
                permanent: true
            };
        }

        return null;
    }, []);


    // Fonction pour animer la progression des points

    const animatePoints = useCallback((startIndex = 0) => {
        animatePointsRef.current = animatePoints;
        clearAnimationTimers();
        clearSpecialEventTimer();

        // Si soloOnly, utilise journeyAllPoints filtré, sinon journeyPoints
        let pointsToAnimate;
        if (soloOnly) {
            pointsToAnimate = journeyAllPoints
                .filter(Boolean)
                .filter(p => p.solo === true || p.solo === 'true' || p.solo === 1 || p.solo === '1')
                .filter(p => p.entry_id >= 349 && p.entry_id <= 710)
                .sort((a, b) => new Date(a.date) - new Date(b.date));
        } else {
            pointsToAnimate = [...journeyPoints]
                .filter(Boolean)
                .sort((a, b) => new Date(a.date) - new Date(b.date));
        }

        if (pointsToAnimate.length === 0) {
            //
            return;
        }

        if (startIndex === 0) {
            setVisiblePoints([]);
            setLastPoint(null);
            setSpecialEvent(null);
        }

        setIsAnimating(true);
        animationStateRef.current.isComplete = false;

        for (let i = startIndex; i < pointsToAnimate.length; i++) {
            const point = pointsToAnimate[i];
            const delay = (i - startIndex) * animationSpeed;

            const timer = setTimeout(() => {
                animationStateRef.current.currentIndex = i;

                setVisiblePoints(prev => {
                    const newPoints = [...prev, point];
                    setLastPoint(point);
                    return newPoints;
                });

                if (globeRef.current) {
                    globeRef.current.pointOfView({
                        lat: point.lat,
                        lng: point.lng,
                        altitude: 1.5
                    }, 1000);

                    if (point.entry_id === 713) {
                        globeRef.current.controls().autoRotate = false;
                    }
                }

                const event = checkSpecialEvents(point);
                if (event) {
                    clearAnimationTimers();
                    clearSpecialEventTimer();
                    setSpecialEvent(event);

                    if (globeRef.current) {
                        globeRef.current.controls().autoRotate = false;
                    }

                    if (!event.permanent) {
                        const nextIndex = i + 1;
                        //

                        specialEventTimerRef.current = setTimeout(() => {
                            //
                            setSpecialEvent(null);

                            if (nextIndex < pointsToAnimate.length) {
                                const newStartIndex = nextIndex;

                                if (globeRef.current && !(point.entry_id === 713)) {
                                    globeRef.current.controls().autoRotate = true;
                                }

                                animatePoints(newStartIndex);
                            }
                        }, 6000);
                    } else {
                        // Si l'événement est permanent (entry_id 713) et que c'est le dernier point
                        if (i === pointsToAnimate.length - 1) {
                            setTimeout(() => {
                                setIsAnimating(false);
                                animationStateRef.current.isComplete = true;
                                // Réactiver la rotation automatique à la fin du voyage
                                if (globeRef.current) {
                                    globeRef.current.controls().autoRotate = true;
                                    globeRef.current.controls().autoRotateSpeed = 0.5;
                                }
                            }, 1000);
                        }
                    }

                    return;
                }

                if (i === pointsToAnimate.length - 1) {
                    setTimeout(() => {
                        //
                        setIsAnimating(false);
                        animationStateRef.current.isComplete = true;
                        // Réactiver la rotation automatique à la fin de l'animation
                        if (globeRef.current) {
                            globeRef.current.controls().autoRotate = true;
                            globeRef.current.controls().autoRotateSpeed = 0.5;
                        }
                    }, 1000);
                }
            }, delay);

            animationTimersRef.current.push(timer);
        }
    }, [animationSpeed, journeyPoints, checkSpecialEvents, clearAnimationTimers, clearSpecialEventTimer, soloOnly]);

    // Réinitialiser l'animation
    const resetAnimation = useCallback(() => {
        //
        setAutoStartAnimation(false);
        clearAnimationTimers();
        clearSpecialEventTimer();
        setIsAnimating(false);
        setSpecialEvent(null);

        // Déterminer la liste filtrée pour le reset
        let pointsToAnimate;
        if (soloOnly) {
            pointsToAnimate = journeyAllPoints
                .filter(Boolean)
                .filter(p => p.solo === true || p.solo === 'true' || p.solo === 1 || p.solo === '1')
                .filter(p => p.entry_id >= 349 && p.entry_id <= 710)
                .sort((a, b) => new Date(a.date) - new Date(b.date));
        } else {
            pointsToAnimate = [...journeyPoints]
                .filter(Boolean)
                .sort((a, b) => new Date(a.date) - new Date(b.date));
        }

        // Démarrer à entry_id 350 si soloOnly, sinon à 1
        const soloStartId = 350;
        const normalStartId = 1;
        const startId = soloOnly ? soloStartId : normalStartId;
        const startIndex = pointsToAnimate.findIndex(point => point.entry_id === startId);
        const indexToStart = startIndex !== -1 ? startIndex : 0;

        animationStateRef.current = {
            currentIndex: indexToStart,
            pausedAtIndex: indexToStart,
            isComplete: false
        };

        // Lancer l'animation uniquement si la liste n'est pas vide
        if (pointsToAnimate.length > 0) {
            animatePoints(indexToStart);
        }
    }, [animatePoints, journeyPoints, clearAnimationTimers, clearSpecialEventTimer, soloOnly]);

    // Exposer la méthode resetAnimation via la ref
    useImperativeHandle(ref, () => ({
        resetAnimation: () => {
            resetAnimation();
        }
    }));

    // Charger les données des pays pour le globe et récupérer les points
    useEffect(() => {
        //

        // SOLUTION SIMPLE: Toujours démarrer avec tous les points
        setSelectedYear("All");
        dispatch(fetchPoints()); // Ceci charge TOUS les points
        fetch("assets/ne_110m_admin_0_countries.geojson")
            .then(res => res.json())
            .then(data => {
                setCountries(data.features);
            });

        if (globeRef.current) {
            globeRef.current.controls().autoRotate = true;
            globeRef.current.controls().autoRotateSpeed = 0.5;
            globeRef.current.pointOfView({ lat: 40, lng: 5, altitude: 2.5 });
        }
    }, [dispatch]);

    // Générer des couleurs pour chaque année présente dans les données
    useEffect(() => {
        if (journeyPoints.length > 0) {
            const currentYear = new Date().getFullYear();
            const years = [...new Set(journeyPoints.map(point => point.year))]
                .filter(year => year !== currentYear)
                .sort();
            const colors = {};

            years.forEach((year, index) => {
                colors[year] = colorPalette[index % colorPalette.length];
            });
        }
    }, [journeyPoints, colorPalette]);


    // NOUVEAU useEffect fiable sur points/selectedYear/autoStartAnimation
    useEffect(() => {
        if (autoStartAnimation && points.length > 0) {
            setIsAnimating(false);
            setVisiblePoints([]);
            // Lancer l'animation après le reset effectif
            setTimeout(() => {
                const journeyPoints = points.map(point => {
                    let dateObj;
                    try {
                        dateObj = new Date(point.date);
                        if (isNaN(dateObj.getTime())) {
                            throw new Error('Invalid date');
                        }
                    } catch (error) {
                        dateObj = new Date();
                    }
                    const year = String(dateObj.getFullYear());
                    return {
                        ...point,
                        lat: point.lat || point.lat,
                        lng: point.long || point.long,
                        label: point.name || point.description || "Point",
                        date: dateObj.toISOString().split('T')[0],
                        year: year
                    };
                });
                const startIndex = journeyPoints.findIndex(point => point.entry_id === 1);
                const indexToStart = startIndex !== -1 ? startIndex : 0;
                animationStateRef.current = {
                    currentIndex: indexToStart,
                    pausedAtIndex: indexToStart,
                    isComplete: false
                };
                animatePoints(indexToStart);
            }, 0);
        }
    }, [points, selectedYear, autoStartAnimation]);


    // Mettre à jour le dernier point affiché chaque fois que visiblePoints change
    useEffect(() => {
        if (visiblePoints.length > 0) {
            const lastVisiblePoint = visiblePoints[visiblePoints.length - 1];
            setLastPoint(lastVisiblePoint);

            const pointId = String(lastVisiblePoint.entry_id);
            //

            if (pointId === "713") {
                if (globeRef.current) {
                    globeRef.current.controls().autoRotate = false;
                }
            }
        }
    }, [visiblePoints]);


    // Fonction pour basculer l'état de l'animation (pause/reprise)
    const toggleAnimation = () => {
        // ON/OFF ne doit pas toucher autoStartAnimation sauf pour reset complet
        if (isAnimating) {
            clearAnimationTimers();
            clearSpecialEventTimer();
            animationStateRef.current.pausedAtIndex = animationStateRef.current.currentIndex + 1;
            if (globeRef.current) {
                globeRef.current.controls().autoRotate = false;
            }
            setIsAnimating(false);
        } else {
            // Si l'animation est terminée, on ne relance que si autoStartAnimation est true
            if (animationStateRef.current.isComplete && autoStartAnimation) {
                resetAnimation();
            } else if (!animationStateRef.current.isComplete) {
                const resumeIndex = animationStateRef.current.pausedAtIndex;
                if (globeRef.current && lastPoint?.entry_id !== 713) {
                    globeRef.current.controls().autoRotate = true;
                }
                animatePoints(resumeIndex);
            }
        }
    };

    // Fonction pour obtenir la couleur d'un point en fonction de son année
    const getPointColor = (point) => {
        if (selectedYear !== "All" && yearColorMap[selectedYear]) {
            return yearColorMap[selectedYear];
        }
        return yearColorMap[point.year] || "#FF5733";
    };

    // Nettoyer les timers lorsque le composant est démonté
    useEffect(() => {
        return () => {
            clearAnimationTimers();
        };
    }, [clearAnimationTimers]);

    // Dans le rendu JSX, juste avant le return :
    //

    // Fonction pour passer de soloOnly à tous les points
    const soloToAll = () => {
        setSoloOnly(false);
        setSelectedYear('All');
        setAutoStartAnimation(true); // force le reset de l'animation
        dispatch(fetchPoints()); // recharge les points "All" systématiquement
        // Optionnel : vider les points visibles si besoin
        // setVisiblePoints([]);
    };

    return (
        <div className="chart-container" >
            <DisableScrollZoom />
            <header id="Chart-3dHeader" className="header-3D">
                <p className="header-text-3D">Le voyage d'Hakuna Matata</p>

                <div className="filter-Main-Container-3D">

                    <div className="ChartFilterSymbolHolder-3D">
                        <button onClick={() => setIsFilterButton(isfilterButton === "" ? "on" : "")} className="ChartFilterHolder-3D" title="Afficher les filtres" type="button" aria-expanded="false" aria-haspopup="true">
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="transform: rotate(0deg); transition: transform 0.2s;"><polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46 22,3"></polygon></svg>
                            {isfilterButton === "" ? "Filters On" : "Filters Off"}
                        </button>
                    </div>



                    <div id="year-date-filter-container" className={isfilterButton ? "year-date-filter-containerON" : "year-date-filter-containerOFF"}>
                        <YearFilter3D selectedYear={selectedYear} onYearChange={handleYearChange} />
                        <SoloFilter3D soloOnly={soloOnly} setSoloOnly={handleSoloChange} soloToAll={soloToAll} />
                    </div>

                </div>



                <div id="Chart/Map-container" className="ChartMapContainer">
                    <p className="button-3D-Help" onClick={() => setShowHelpWindow(true)}>Help</p>
                    <p className="button-2D" onClick={onBack} >Retour à Dashboard</p>
                </div>

                {/* Fenêtre d'aide */}
                <HelpWindows open={showHelpWindow} onClose={() => setShowHelpWindow(false)} />

            </header>

            {/* {loading && <div className="loading">Chargement des données...</div>} */}
            {error && <div className="error">Erreur: {error}</div>}

            <div className="globe-container">
                <Globe
                    ref={globeRef}
                    globeImageUrl="assets/earth-blue-marble.jpg"
                    bumpImageUrl="assets/earth-topology.png"
                    backgroundImageUrl="assets/night-sky.png"

                    hexPolygonsData={countries}
                    hexPolygonResolution={3}
                    hexPolygonMargin={0.3}
                    hexPolygonColor={() => "rgba(255, 255, 255, 0.1)"}

                    htmlElementsData={visiblePoints}
                    htmlElement={d => {
                        const el = document.createElement('div')

                        if (lastPoint && d.entry_id === lastPoint.entry_id) {
                            const color = getPointColor(d);

                            el.style.width = '34px';
                            el.style.height = '34px';
                            el.style.backgroundColor = color;
                            el.style.webkitMaskImage = `url(${shipSVG})`;
                            el.style.maskImage = `url(${shipSVG})`;
                            el.style.webkitMaskSize = 'contain';
                            el.style.maskSize = 'contain';
                            el.style.webkitMaskRepeat = 'no-repeat';
                            el.style.maskRepeat = 'no-repeat';
                            el.style.webkitMaskPosition = 'center';
                            el.style.maskPosition = 'center';

                            el.className = 'ship-marker';
                        } else {
                            el.style.backgroundColor = getPointColor(d)
                            el.style.width = '8px'
                            el.style.height = '8px'
                            el.style.borderRadius = '50%'
                        }

                        return el
                    }}
                    htmlAltitude={d => {
                        if (lastPoint && d.entry_id === lastPoint.entry_id) {
                            return 0.015;
                        }
                        return 0.01;
                    }}
                    htmlTransitionDuration={1000}
                    pointLabel={d => `${d.label}: ${d.date}`}
                />
            </div>

            <div className="journey-info-left">
                <div className="last-point-info">
                    <h3>Log Book</h3>
                    <div className="info-box-dernier-point">
                        {lastPoint && lastPoint.entry_id === 713 ? (
                            <p style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '22px' }}>Voyage terminé</p>
                        ) : (
                            lastPoint && (
                                <>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <div
                                            className="logbook-symbol"
                                            style={{
                                                backgroundColor: getPointColor(lastPoint),
                                                WebkitMaskImage: `url(${process.env.PUBLIC_URL}/assets/shipSVG.svg)`,
                                                maskImage: `url(${process.env.PUBLIC_URL}/assets/shipSVG.svg)`,
                                                WebkitMaskSize: 'contain',
                                                maskSize: 'contain',
                                                WebkitMaskRepeat: 'no-repeat',
                                                maskRepeat: 'no-repeat',
                                                WebkitMaskPosition: 'center',
                                                maskPosition: 'center',
                                                width: '40px',
                                                height: '40px',
                                                marginRight: '10px',
                                                display: 'inline-block'
                                            }}
                                        ></div>
                                        <span className="logbook-year">{lastPoint.year || 'N/A'}</span>
                                    </div>
                                    <p className="logbook-description">{lastPoint.description || 'Aucune description disponible'}</p>
                                </>
                            )
                        )}
                    </div>
                </div>

                <div className="last-point-info">
                    <h3>Evenements</h3>
                    <div className="info-box-events">
                        {/* Affichage du bandeau 'Navigation en solitaire' si soloOnly actif, au-dessus des événements */}
                        {soloOnly && (
                            <div style={{
                                fontWeight: 'bold',
                                marginTop: '8px',
                                marginBottom: '2px',
                                textAlign: 'center',
                                fontSize: '24px',
                                color: '#eaff00ff',
                            }}>
                                Navigation en solitaire
                            </div>
                        )}
                        {specialEvent && specialEvent.message ? (
                            <div className="special-event">
                                <p className="special-event-message">{specialEvent.message}</p>
                            </div>
                        ) : (
                            <p></p>
                        )}
                    </div>
                </div>
            </div>

            <div className="journey-info-right">
                <div className="last-point-info">
                    <h3>Légende des années</h3>
                    <div className="info-box">
                        <div className="year-colors-legend">
                            {availableYears
                                .filter(year => year !== "All")
                                .map(year => (
                                    <div key={year} className="legend-item">
                                        <span className="legend-dot" style={{ backgroundColor: yearColorMap[year] }}></span>
                                        <span>{year}</span>
                                    </div>
                                ))}
                        </div>
                    </div>
                </div>
                <div className="last-point-info">
                    <h3>Contrôles d'animation</h3>
                    <div className="info-box info-box-animation">
                        <div className="animation-controls-container">
                            <label className="on-off-label">
                                Animation On - Off :
                            </label>
                            <button id="buttonAnimation"
                                onClick={() => { /* Nettoyage : console.log supprimé */ toggleAnimation(); }}
                                className={`buttonAnimation ${isAnimating ? 'active' : ''}`}
                            >
                                Animation {!isAnimating ? 'ON' : 'OFF'}
                            </button>

                        </div>
                        <div className="speed-control-container">
                            <label className="speed-label">
                                Vitesse :
                            </label>
                            <select id="comboVitesse"
                                value={animationSpeed}
                                onChange={(e) => setAnimationSpeed(Number(e.target.value))}
                                className="comboVitesse"
                                disabled={isAnimating}
                            >
                                <option value="400">Rapide</option>
                                <option value="1000">Normale</option>
                                <option value="2000">Lente</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
});

export default Chart3D;