import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import './PictureAlbumFilter.css';

const PictureAlbumFilter = ({ onFilterChange }) => {
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedSubCategory, setSelectedSubCategory] = useState('');

    // Écouter les changements du store Redux pour synchroniser les filtres
    const reduxSelectedCategory = useSelector(state => {
        // Protection contre les erreurs si le store n'est pas encore initialisé
        if (!state || !state.pictureAlbum) return '';
        return state.pictureAlbum.selectedCategory || '';
    });
    const reduxSelectedSubCategory = useSelector(state => {
        // Protection contre les erreurs si le store n'est pas encore initialisé
        if (!state || !state.pictureAlbum) return '';
        return state.pictureAlbum.selectedSubCategory || '';
    });

    // Synchroniser l'état local avec Redux quand le store change
    useEffect(() => {
        setSelectedCategory(reduxSelectedCategory);
        setSelectedSubCategory(reduxSelectedSubCategory);
    }, [reduxSelectedCategory, reduxSelectedSubCategory]);



    const categories = {
        'En Mer': ['Atlantique', 'Pacifique', 'Indien'],
        'Evénements': ['Chantier', 'Fêtes', 'Divers', 'Passage du canal de Panama', 'Tsunami 2004', 'Cape de bonne Espérance'],
        'Escales': ['Europe', 'Amérique du Nord', 'Amérique Centrale', 'Amérique du Sud', 'Antilles', 'Océanie Indien', 'Océanie Pacifique', 'Polynésie française', 'Australie', 'Asie', 'Afrique'],
        'Equipage': ['Martin', 'Julien', 'Mathias', 'Neijma'],
        'Monuments': ['New York', 'Washington', 'Sydney', 'Lisboa', 'Kuala Lumpur']
    };

    const handleCategoryChange = (e) => {
        const category = e.target.value;
        setSelectedCategory(category);
        setSelectedSubCategory(''); // Reset subcategory when category changes

        if (onFilterChange) {
            onFilterChange({
                category: category,
                subCategory: ''
            });
        }
    };

    const handleSubCategoryChange = (e) => {
        const subCategory = e.target.value;
        setSelectedSubCategory(subCategory);

        if (onFilterChange) {
            onFilterChange({
                category: selectedCategory,
                subCategory: subCategory
            });
        }
    };

    const resetFilters = () => {
        setSelectedCategory('');
        setSelectedSubCategory('');
        if (onFilterChange) {
            onFilterChange({
                category: '',
                subCategory: ''
            });
        }
    };

    return (
        <div className="picture-album-filter-container">
            <div className="filter-section">
                <label className="labelPictureAlbumSelect">Catégorie:</label>
                <select
                    className="picture-album-select"
                    value={selectedCategory}
                    onChange={handleCategoryChange}
                >
                    <option value="">Toutes les catégories</option>
                    {Object.keys(categories).map(category => (
                        <option key={category} value={category}>
                            {category}
                        </option>
                    ))}
                </select>
            </div>

            {selectedCategory && (
                <div className="filter-section">
                    <label className="labelPictureAlbumSelect">Sous-catégorie:</label>
                    <select
                        className="picture-album-select"
                        value={selectedSubCategory}
                        onChange={handleSubCategoryChange}
                    >
                        <option value="">Toutes</option>
                        {categories[selectedCategory].map(subCategory => (
                            <option key={subCategory} value={subCategory}>
                                {subCategory}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            {(selectedCategory || selectedSubCategory) && (
                <button
                    className="reset-filter-button"
                    onClick={resetFilters}
                    title="Réinitialiser les filtres"
                >
                    ✕
                </button>
            )}
        </div>
    );
};

export default PictureAlbumFilter;
