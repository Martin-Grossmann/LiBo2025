import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchPointsBetweenDates, fetchPoints } from '../../store/actions/pointsActions';
import './DateFilter.css';

const DateFilter = ({ setSoloOnly, resetFilter, onResetHandled }) => {
    const dispatch = useDispatch();

    // Get loading state from Redux
    // eslint-disable-next-line no-unused-vars
    // const loading = useSelector(state => state.points.loading);

    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [isFilterActive, setIsFilterActive] = useState(false);

    // Excluded years
    const excludedYears = [2009, 2010, 2011, 2013];

    // Available years (from 1997 to 2013, excluding the excluded years)
    const availableYears = Array.from({ length: 17 }, (_, i) => 1997 + i)
        .filter(year => !excludedYears.includes(year));

    // Debug: Log available years to console
    useEffect(() => {
        //console.log("Available years:", availableYears);
    }, [availableYears]);

    // Reset le filtre date si demandé par le parent
    useEffect(() => {
        if (resetFilter) {
            setStartYear('');
            setStartMonth('');
            setStartDay('');
            setEndYear('');
            setEndMonth('');
            setEndDay('');
            setIsFilterActive(false);
            if (onResetHandled) onResetHandled();
        }
    }, [resetFilter, onResetHandled]);

    // State for custom date selectors
    const [startYear, setStartYear] = useState('');
    const [startMonth, setStartMonth] = useState('');
    const [startDay, setStartDay] = useState('');

    const [endYear, setEndYear] = useState('');
    const [endMonth, setEndMonth] = useState('');
    const [endDay, setEndDay] = useState('');

    // Available months
    const months = [
        { value: '01', label: 'Janvier' },
        { value: '02', label: 'Février' },
        { value: '03', label: 'Mars' },
        { value: '04', label: 'Avril' },
        { value: '05', label: 'Mai' },
        { value: '06', label: 'Juin' },
        { value: '07', label: 'Juillet' },
        { value: '08', label: 'Août' },
        { value: '09', label: 'Septembre' },
        { value: '10', label: 'Octobre' },
        { value: '11', label: 'Novembre' },
        { value: '12', label: 'Décembre' }
    ];

    // Available days (1-31)
    const days = Array.from({ length: 31 }, (_, i) => {
        const day = i + 1;
        return { value: day < 10 ? `0${day}` : `${day}`, label: day };
    });

    // Update the formatted dates when individual components change
    useEffect(() => {
        if (startYear && startMonth && startDay) {
            setStartDate(`${startYear}-${startMonth}-${startDay}`);
        } else {
            setStartDate('');
        }
    }, [startYear, startMonth, startDay]);

    useEffect(() => {
        if (endYear && endMonth && endDay) {
            setEndDate(`${endYear}-${endMonth}-${endDay}`);
        } else {
            setEndDate('');
        }
    }, [endYear, endMonth, endDay]);

    // Reset end date if start date is after end date
    useEffect(() => {
        if (startDate && endDate && startDate > endDate) {
            setEndYear('');
            setEndMonth('');
            setEndDay('');
        }
    }, [startDate, endDate]);

    // Reset end month and day when end year changes
    useEffect(() => {
        setEndMonth('');
        setEndDay('');
    }, [endYear]);

    // Reset end day when end month changes
    useEffect(() => {
        setEndDay('');
    }, [endMonth]);

    // Reset end day when start day changes if same year and month
    useEffect(() => {
        if (startYear === endYear && startMonth === endMonth && startDay > endDay) {
            setEndDay('');
        }
    }, [startDay, endDay, startYear, endYear, startMonth, endMonth]);

    // Get the number of days in a month
    const getDaysInMonth = (year, month) => {
        return new Date(year, month, 0).getDate();
    };

    // Filter days based on selected month and year
    const getFilteredDays = (year, month) => {
        if (!year || !month) return days;

        const daysInMonth = getDaysInMonth(year, parseInt(month));
        let filteredDays = days.filter(day => parseInt(day.value) <= daysInMonth);

        // Cas spécial: juillet 1997 - le voyage commence le 8 juillet
        if (year === '1997' && month === '07') {
            filteredDays = filteredDays.filter(day => parseInt(day.value) >= 8);
        }

        // Cas spécial: juillet 2012 - le voyage se termine le 18 juillet
        if (endYear === '2012' && endMonth === '07') {
            filteredDays = filteredDays.filter(day => parseInt(day.value) <= 18);
        }

        return filteredDays;
    };

    // Get filtered start days
    const filteredStartDays = getFilteredDays(startYear, startMonth);

    // Get available end years based on start year
    const availableEndYears = startYear
        ? availableYears.filter(year => year >= parseInt(startYear))
        : availableYears;

    // Get available end months based on start year and month
    const getAvailableEndMonths = () => {
        if (!endYear) return months;

        // If end year is 2012, limit to months 1-7
        if (endYear === '2012') {
            return months.filter(month => parseInt(month.value) <= 7);
        }

        // If end year is the same as start year
        if (startYear && endYear === startYear) {
            return months.filter(month => parseInt(month.value) >= parseInt(startMonth));
        }

        return months;
    };

    // Get available end days based on start and end dates
    const getAvailableEndDays = () => {
        if (!endYear || !endMonth) return [];

        // Get all days for the selected month/year
        const daysInMonth = getDaysInMonth(endYear, parseInt(endMonth));
        const filteredDays = days.filter(day => parseInt(day.value) <= daysInMonth);

        // If same year and same month, only show days from start day onwards
        if (endYear === startYear && endMonth === startMonth && startDay) {
            return filteredDays.filter(day => parseInt(day.value) >= parseInt(startDay));
        }

        return filteredDays;
    };

    const availableEndDays = getAvailableEndDays();

    const handleSearch = () => {
        if (setSoloOnly) setSoloOnly(false);
        if (startDate && endDate) {
            setIsFilterActive(true);
            dispatch(fetchPointsBetweenDates(startDate, endDate));
        }
    };

    const handleResetFilter = () => {
        setStartYear('');
        setStartMonth('');
        setStartDay('');
        setEndYear('');
        setEndMonth('');
        setEndDay('');
        setIsFilterActive(false);
        dispatch(fetchPoints());
    };

    return (
        <div className="date-filter-main-container">
            <div id="date-filter-container" className='date-filter-container' >
                <div className="date-input-group">
                    <label>Du: </label>
                    <div className="custom-date-selector">
                        <select
                            value={startYear}
                            onChange={(e) => setStartYear(e.target.value)}
                            className="date-select-component"
                        >
                            <option value="">Année</option>
                            {availableYears.map(year => (
                                <option key={year} value={year}>{year}</option>
                            ))}
                        </select>

                        <select
                            value={startMonth}
                            onChange={(e) => setStartMonth(e.target.value)}
                            className="date-select-component"
                            disabled={!startYear}
                        >
                            <option value="">Mois</option>
                            {months
                                .filter(month => {
                                    // Pour 1997, n'afficher que les mois de juillet à décembre
                                    if (startYear === '1997') {
                                        return parseInt(month.value) >= 7;
                                    }
                                    // Pour 2012, n'afficher que les mois de janvier à juillet
                                    if (startYear === '2012') {
                                        return parseInt(month.value) <= 7;
                                    }
                                    // Pour les autres années, afficher tous les mois
                                    return true;
                                })
                                .map(month => (
                                    <option key={month.value} value={month.value}>{month.label}</option>
                                ))
                            }
                        </select>

                        <select
                            value={startDay}
                            onChange={(e) => setStartDay(e.target.value)}
                            className="date-select-component"
                            disabled={!startYear || !startMonth}
                        >
                            <option value="">Jour</option>
                            {filteredStartDays.map(day => (
                                <option key={day.value} value={day.value}>{day.label}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="date-input-group">
                    <label>Au: </label>
                    <div className="custom-date-selector">
                        <select
                            value={endYear}
                            onChange={(e) => setEndYear(e.target.value)}
                            className="date-select-component"
                            disabled={!startDate}
                        >
                            <option value="">Année</option>
                            {availableEndYears.map(year => (
                                <option key={year} value={year}>{year}</option>
                            ))}
                        </select>

                        <select
                            value={endMonth}
                            onChange={(e) => setEndMonth(e.target.value)}
                            className="date-select-component"
                            disabled={!endYear}
                        >
                            <option value="">Mois</option>
                            {getAvailableEndMonths().map(month => (
                                <option key={month.value} value={month.value}>{month.label}</option>
                            ))}
                        </select>

                        <select
                            value={endDay}
                            onChange={(e) => setEndDay(e.target.value)}
                            className="date-select-component"
                            disabled={!endYear || !endMonth}
                        >
                            <option value="">Jour</option>
                            {availableEndDays.map(day => (
                                <option key={day.value} value={day.value}>{day.label}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>
            <div id="buttonContainer" className='buttonContainer'>
                <button
                    className="date-search-button"
                    onClick={handleSearch}
                    disabled={!startDate || !endDate}
                >
                    Rechercher
                </button>

                {isFilterActive && (
                    <button
                        className="date-reset-button"
                        onClick={handleResetFilter}
                    >
                        Réinitialiser
                    </button>
                )}
            </div>
        </div>
    );
};

export default DateFilter;