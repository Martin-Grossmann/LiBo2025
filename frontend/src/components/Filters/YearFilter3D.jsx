import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchPointsByYear, fetchPoints } from '../../store/actions/pointsActions3D';
import './YearFilter.css';

const YearFilter3D = ({ selectedYear, onYearChange }) => {
    const dispatch = useDispatch();

    // Définir l'année de départ comme valeur par défaut
    const startYear = 1997;
    // Remplacer l'année actuelle par la dernière année du voyage (2025 selon le nom du repo)
    const endYear = 2012;
    // Créer un tableau d'années et filtrer pour exclure 2009, 2010 et 2011
    const years = Array.from({ length: endYear - startYear + 1 }, (_, i) => String(startYear + i))
        .filter(year => year !== "2009" && year !== "2010" && year !== "2011");

    // Charger les points pour l'option sélectionnée par défaut au chargement
    useEffect(() => {
        if (selectedYear === 'all' || selectedYear === 'All') {
            dispatch(fetchPoints());
        } else {
            dispatch(fetchPointsByYear(selectedYear));
        }
    }, [dispatch, selectedYear]);

    const handleYearChange = (e) => {
        const year = e.target.value;
        onYearChange(year);

        if (year === 'all' || year === 'All') {
            dispatch(fetchPoints());
        } else {
            dispatch(fetchPointsByYear(year));
        }
    };

    return (
        <>
            <div className="year-filter-container">
                <label htmlFor="year-select" className='labelYearSelect'>Filtrer par année: </label>
                <select
                    id="year-select"
                    value={selectedYear}
                    onChange={handleYearChange}
                    className="year-select"
                >
                    <option value="all">All</option>
                    {years.map(year => (
                        <option key={year} value={year}>
                            {year}
                        </option>
                    ))}
                </select>
            </div>

            <div id="date-filter-container">
            </div>
        </>
    );
};

export default YearFilter3D;
