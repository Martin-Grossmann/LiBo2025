import React, { useState } from 'react';
import './PictureAlbumFilter.css';

const PictureAlbumFilterCompact = ({ onFilterChange }) => {
    const [selectedValue, setSelectedValue] = useState('');

    const handleFilterChange = (e) => {
        const value = e.target.value;
        setSelectedValue(value);

        if (onFilterChange) {
            // Parse the value to extract category and subcategory
            if (value) {
                const [category, subCategory] = value.split('|');
                onFilterChange({
                    category: category,
                    subCategory: subCategory,
                    fullValue: value
                });
            } else {
                onFilterChange({
                    category: '',
                    subCategory: '',
                    fullValue: ''
                });
            }
        }
    };

    const resetFilter = () => {
        setSelectedValue('');
        if (onFilterChange) {
            onFilterChange({
                category: '',
                subCategory: '',
                fullValue: ''
            });
        }
    };

    return (
        <div className="picture-album-filter-container-compact">
            <label className="labelPictureAlbumSelect">Filtrer par:</label>
            <select
                className="picture-album-select"
                value={selectedValue}
                onChange={handleFilterChange}
            >
                <option value="">Tous les critères</option>

                <optgroup label="En Mer">
                    <option value="En Mer|Atlantique">Atlantique</option>
                    <option value="En Mer|Pacifique">Pacifique</option>
                    <option value="En Mer|Indien">Indien</option>
                </optgroup>

                <optgroup label="Evénements">
                    <option value="Evénements|Chantier">Chantier</option>
                    <option value="Evénements|Fêtes">Fêtes</option>
                    <option value="Evénements|Divers">Divers</option>
                </optgroup>

                <optgroup label="Escales">
                    <option value="Escales|Europe">Europe</option>
                    <option value="Escales|Amérique">Amérique</option>
                    <option value="Escales|Océanie">Océanie</option>
                    <option value="Escales|Asie">Asie</option>
                    <option value="Escales|Afrique">Afrique</option>
                </optgroup>

                <optgroup label="Equipage">
                    <option value="Equipage|Martin">Martin</option>
                    <option value="Equipage|Julien">Julien</option>
                    <option value="Equipage|Mathias">Mathias</option>
                    <option value="Equipage|Neijma">Neijma</option>
                </optgroup>
            </select>

            {selectedValue && (
                <button
                    className="reset-filter-button"
                    onClick={resetFilter}
                    title="Réinitialiser le filtre"
                >
                    ✕
                </button>
            )}
        </div>
    );
};

export default PictureAlbumFilterCompact;
