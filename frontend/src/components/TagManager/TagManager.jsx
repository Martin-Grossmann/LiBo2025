import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchTags, createTag, updateTag, deleteTag } from "../../store/actions/tagsActions"
import TagForm from "./TagForm"
import TagList from "./TagList"
import styles from "./TagManager.module.css"

const TagManager = () => {
    const dispatch = useDispatch()

    // Add this to debug the entire state
    const wholeState = useSelector(state => state)
    console.log("Whole Redux state:", wholeState)

    // Change this line to see exactly what's in state.tags
    const tagsState = useSelector((state) => state.tags)
    console.log("Tags state:", tagsState)

    // Then destructure with defaults
    const { items: tags = [], loading = false, error = null } = tagsState || {}

    const [selectedTag, setSelectedTag] = useState(null)
    const [isFormVisible, setIsFormVisible] = useState(false)
    const [isEditMode, setIsEditMode] = useState(false)

    useEffect(() => {
        dispatch(fetchTags())
    }, [dispatch])

    const handleCreateTag = async (tagData) => {
        try {
            await dispatch(createTag(tagData))
            setIsFormVisible(false)
            setSelectedTag(null)
        } catch (error) {
            console.error("Error creating tag:", error)
        }
    }

    const handleUpdateTag = async (tagData) => {
        try {
            await dispatch(updateTag(selectedTag.id, tagData))
            setIsFormVisible(false)
            setSelectedTag(null)
            setIsEditMode(false)
        } catch (error) {
            console.error("Error updating tag:", error)
        }
    }

    const handleDeleteTag = async (id) => {
        if (window.confirm("Are you sure you want to delete this tag?")) {
            try {
                await dispatch(deleteTag(id))
                if (selectedTag && selectedTag.id === id) {
                    setSelectedTag(null)
                    setIsFormVisible(false)
                    setIsEditMode(false)
                }
            } catch (error) {
                console.error("Error deleting tag:", error)
            }
        }
    }

    const handleEditClick = (tag) => {
        setSelectedTag(tag)
        setIsEditMode(true)
        setIsFormVisible(true)
    }

    const handleAddNewClick = () => {
        setSelectedTag(null)
        setIsEditMode(false)
        setIsFormVisible(true)
    }

    const handleCancelForm = () => {
        setIsFormVisible(false)
        setSelectedTag(null)
        setIsEditMode(false)
    }

    return (
        <div className={styles.tagManager}>
            <h2 className={styles.title}>Tag Manager</h2>

            {error && <div className={styles.error}>Error: {error}</div>}

            <div className={styles.actionBar}>
                <button
                    className={styles.addButton}
                    onClick={handleAddNewClick}
                    disabled={isFormVisible}
                >
                    Add New Tag
                </button>
            </div>

            <div className={styles.content}>
                <div className={styles.listContainer}>
                    {loading ? (
                        <div className={styles.loading}>Loading tags...</div>
                    ) : (
                        <TagList
                            tags={tags}
                            onEditClick={handleEditClick}
                            onDeleteClick={handleDeleteTag}
                            selectedTagId={selectedTag?.id}
                        />
                    )}
                </div>

                {isFormVisible && (
                    <div className={styles.formContainer}>
                        <TagForm
                            initialData={selectedTag}
                            isEditMode={isEditMode}
                            onSubmit={isEditMode ? handleUpdateTag : handleCreateTag}
                            onCancel={handleCancelForm}
                        />
                    </div>
                )}
            </div>
        </div>
    )
}

export default TagManager