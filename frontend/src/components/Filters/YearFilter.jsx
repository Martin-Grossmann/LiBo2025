import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchPointsByYear, fetchPoints } from '../../store/actions/pointsActions';
import './YearFilter.css';


const YearFilter = ({ selectedYear, setSelectedYear, setSoloOnly }) => {
    const dispatch = useDispatch();

    const startYear = 1997;
    const endYear = 2012;
    const years = Array.from({ length: endYear - startYear + 1 }, (_, i) => startYear + i)
        .filter(year => year !== 2009 && year !== 2010 && year !== 2011);

    useEffect(() => {
        if (selectedYear === 'all') {
            dispatch(fetchPoints());
        } else {
            dispatch(fetchPointsByYear(selectedYear));
        }
    }, [dispatch, selectedYear]);

    const handleYearChange = (e) => {
        const year = e.target.value;
        setSelectedYear(year);
        if (setSoloOnly) setSoloOnly(false);
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

export default YearFilter;
