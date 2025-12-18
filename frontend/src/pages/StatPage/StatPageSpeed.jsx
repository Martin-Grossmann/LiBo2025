import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchStats } from "../../store/actions/statActions"
import "./StatPageSpeed.css"

const StatPageSpeed = ({ onBack, title }) => {
    const dispatch = useDispatch()
    const { stats, loading, error } = useSelector((state) => state.stats)
    const [navigationEntries, setNavigationEntries] = useState([])


    useEffect(() => {
        dispatch(fetchStats())
    }, [dispatch])

    // Extraire les données du tableau stats
    useEffect(() => {
        if (stats && Array.isArray(stats)) {
            // console.log("Analyse des données stats:", stats)

            // Créer un tableau d'entrées où chaque entrée contient toutes les informations associées
            const entries = stats.map(item => {
                return {
                    date: item.toPoint?.date || "Date non disponible",
                    description: item.toPoint?.description || "Description non disponible",
                    distance: item.distance ? `${item.distance} Nm` : "Distance non disponible",
                    speed: item.averageSpeed ? `${item.averageSpeed} nœuds` : "Vitesse non disponible"
                }
            })

            setNavigationEntries(entries.length > 0 ? entries : [{
                date: "Aucune donnée",
                description: "Aucune donnée",
                distance: "Aucune donnée",
                speed: "Aucune donnée"
            }])
        }
    }, [stats])

    return (
        <>
            <div className="stat-pageSpeed-content">
                <header id="StatSpeedHeader" className="header-speed ">
                    <p className="header-text-speed">{title}</p>
                    <p onClick={onBack} className="button-speed">
                        Retour à Statistique
                    </p>
                </header>


                {loading ? (
                    <div className="speed-loading">Chargement des statistiques...</div>
                ) : error ? (
                    <div className="speed-error">Erreur: {error}</div>
                ) : (
                    <div className="speed-stats-container">

                        <table className="speed-navigation-table">
                            <colgroup>
                                <col className="speed-col-num" />
                                <col className="speed-col-date" />
                                <col className="speed-col-desc" />
                                <col className="speed-col-dist" />
                                <col className="speed-col-speed" />
                            </colgroup>
                            <thead className="speed-table-header">
                                <tr className="tr-speed">
                                    <th></th>
                                    <th>Date</th>
                                    <th>Description</th>
                                    <th>Distance/24h</th>
                                    <th>Vitesse Moyenne</th>
                                </tr>
                            </thead>
                            <tbody>
                                {navigationEntries.map((entry, index) => (
                                    <tr key={index} className="tr-speed">
                                        <td><span className="speed-value-num">{index + 1}</span></td>
                                        <td><span className="speed-value-date">{entry.date}</span></td>
                                        <td><span className="speed-value-desc">{entry.description}</span></td>
                                        <td><span className="speed-value-dist">{entry.distance}</span></td>
                                        <td><span className="speed-value-speed">{entry.speed}</span></td>
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

export default StatPageSpeed