import React, { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { fetchLongestStops } from "../../store/actions/statActions"
import "./StatPageEscale.css"

const StatPageEscale = ({ onBack, title }) => {
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [stops, setStops] = useState([])
    const [totalStops, setTotalStops] = useState(0)

    const dispatch = useDispatch()



    useEffect(() => {
        const loadStops = async () => {
            console.log("StatPageEscale: Processing loadStops")
            try {
                setLoading(true)
                const data = await dispatch(fetchLongestStops())
                console.log("Received stops data:", data)
                setStops(data.stops || [])
                setTotalStops(data.totalStops || 0)
                setLoading(false)
            } catch (err) {
                console.error("Error loading stops:", err)
                setError(err.message || "Failed to load stops data")
                setLoading(false)
            }
        }

        loadStops()
    }, [dispatch])

    return (
        <>
            <div className="stat-pageEscale-content">
                <header id="statEscaleHeaderr" className="header-escale">
                    <p className="header-text-escale">{title} {totalStops ? `(${totalStops})` : null}</p>
                    <p onClick={onBack} className="button-escale">
                        Retour à Statistique
                    </p>
                </header>

                {loading ? (
                    <div className="loading">Chargement des données...</div>
                ) : error ? (
                    <div className="error">Erreur: {error}</div>
                ) : (
                    <div className="escale-container">
                        <table className="escale-navigation-table">
                            <colgroup>
                                <col className="escale-col-num" />
                                <col className="escale-col-date1" />
                                <col className="escale-col-descr" />
                                <col className="escale-col-date2" />
                                <col className="esale-col-duration" />
                            </colgroup>
                            <thead className="escale-table-header">
                                <tr>
                                    <th></th>
                                    <th>Date Arrivée</th>
                                    <th>Description Arrivée</th>
                                    <th>Date Départ</th>
                                    <th>Durée</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stops.map((stop, index) => (
                                    <tr key={index} className="tr-container">
                                        <td><span className="escale-value-id">{index + 1}</span></td>
                                        <td><span className="escale-value-arrivee">{new Date(stop.startPoint.date).toLocaleDateString('fr-FR')}</span></td>
                                        <td><span className="escale-value-description">{stop.startPoint.description}</span></td>
                                        <td><span className="escale-value-depart">{new Date(stop.departureDate).toLocaleDateString('fr-FR')}</span></td>
                                        <td><span className="escale-value-duree">{stop.duration.formatted}</span></td>
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

export default StatPageEscale
