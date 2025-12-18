import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchLongestNavigations } from "../../store/actions/statActions"
import "./StatPageNav.css"

const StatPageNav = ({ onBack, title }) => {
    console.log("Nav: title: ", title)
    const dispatch = useDispatch()
    const { stats, loading, error } = useSelector(state => state.stats)
    const [navigationEntries, setNavigationEntries] = useState([])



    useEffect(() => {
        dispatch(fetchLongestNavigations())
            .then(data => {
                console.log("Longest navigations data:", data)

                // Log detailed information about longest navigations
                if (data && data.stats) {
                    console.log("Total navigations:", data.stats.totalNavigations)

                    if (data.stats.longestByDistance) {
                        console.log("Longest navigation by distance:", {
                            from: data.stats.longestByDistance.startPoint.description,
                            to: data.stats.longestByDistance.endPoint.description,
                            distance: data.stats.longestByDistance.totalDistance + " " + data.stats.longestByDistance.unit,
                            duration: data.stats.longestByDistance.durationDays + " days",
                            points: data.stats.longestByDistance.pointCount
                        })
                    }
                }
            })
            .catch(error => {
                console.error("Error fetching longest navigations:", error)
            })
    }, [dispatch]);

    // Extract data from stats
    useEffect(() => {
        if (stats && stats.navigations && Array.isArray(stats.navigations)) {
            //console.log("Processing navigation data:", stats.navigations)

            // Create entries array with all the information
            const entries = stats.navigations.map((nav, index) => {
                return {
                    id: index + 1,
                    startDescription: nav.startPoint?.description || "Description non disponible",
                    endDescription: nav.endPoint?.description || "Description non disponible",
                    totalDistance: nav.totalDistance ? `${nav.totalDistance} ${nav.unit}` : "Distance non disponible",
                    duration: nav.durationDays ? `${nav.durationDays} jours` : "Durée non disponible"
                }
            })

            setNavigationEntries(entries.length > 0 ? entries : [{
                id: "-",
                startDescription: "Aucune donnée",
                endDescription: "Aucune donnée",
                totalDistance: "Aucune donnée",
                duration: "Aucune donnée"
            }])
        }
    }, [stats])

    return (
        <>
            <div className="stat-pageNav-content">
                <header id="stat-pageNav-Header" className="header-nav">
                    <p className="header-text-nav">{title}</p>
                    <p onClick={onBack} className="button-nav">
                        Retour à Statistique
                    </p>
                </header>

                {loading ? (
                    <div className="trip-loading">Chargement des statistiques...</div>
                ) : error ? (
                    <div className="trip-error">Erreur: {error}</div>
                ) : (
                    <div className="trip-stats-container">


                        <table className="trip-navigation-table">
                            <colgroup>
                                <col className="trip-col-num" />
                                <col className="trip-col-descr1" />
                                <col className="trip-col-descr2" />
                                <col className="trip-col-dist" />
                                <col className="trip-col-duration" />
                            </colgroup>
                            <thead className="nav-table-header">
                                <tr >
                                    <th></th>
                                    <th>Description Départ</th>
                                    <th>Description Arrivée</th>
                                    <th>Total Distance</th>
                                    <th>Durée</th>
                                </tr>
                            </thead>
                            <tbody>
                                {navigationEntries.map((entry, index) => (
                                    <tr key={index} className="tr-container">
                                        <td><span className="trip-value-id">{entry.id}</span></td>
                                        <td><span className="trip-value-start">{entry.startDescription}</span></td>
                                        <td><span className="trip-value-end">{entry.endDescription}</span></td>
                                        <td><span className="trip-value-dist">{entry.totalDistance}</span></td>
                                        <td><span className="trip-value-duration">{entry.duration}</span></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>


                    </div>
                )}
            </div>
        </>
    )
}

export default StatPageNav
