import React, { useEffect, useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogTitle,
    Stack,
    TextField,
    MenuItem,
} from '@mui/material'
import Button from '../../atoms/Button'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import { useReleases } from '../../../contexts/ReleaseContext'
import { useArtists } from '../../../contexts/ArtistContext'
import { useGenres } from '../../../contexts/GenreContext'
import FileUploadRelease from '../../molecules/FileUploadRelease'

const validationSchema = Yup.object().shape({
    title: Yup.string().required('Title is required'),
    release_date: Yup.date().required('Release date is required'),
    genre_id: Yup.number().required('Genre is required'),
    release_type: Yup.string().required('Release type is required'),
    artist_id: Yup.array().of(Yup.number().min(1, 'At least one artist is required')),
    bandcamp_link: Yup.string(),
    beatport_link: Yup.string(),
    spotify_link: Yup.string(),
    apple_music_link: Yup.string(),
    youtube_link: Yup.string(),
    soundcloud_link: Yup.string(),
    cover_image_url: Yup.mixed(),
    description: Yup.string(),

})

const AddReleaseForm = ({ onReleaseAdded }) => {
    const [open, setOpen] = useState(false)
    const { createRelease } = useReleases()
    const [error, setError] = useState(null)
    const { artists, fetchArtists } = useArtists()
    const { genres, fetchGenres } = useGenres()

    useEffect(() => {
        fetchArtists()
        fetchGenres()
    }, [fetchArtists, fetchGenres])

    const handleOpen = () => {
        setOpen(true)
    }

    const handleClose = () => {
        setOpen(false)
        setError(null)
    }

    const onSubmit = async (values, actions) => {
        const formData = new FormData()
        Object.keys(values).forEach(key => {
            formData.append(key, values[key])
        })
        console.log('Submitting form with values:', values)

        try {
            const newRelease = await createRelease(formData)
            console.log('Release created successfully:', newRelease)

            actions.setSubmitting(false)
            handleClose()
            onReleaseAdded && onReleaseAdded(newRelease)
        } catch (error) {
            console.error('Error adding release:', error)
            setError('Failed to add release')
            actions.setSubmitting(false)
        }
    }

    return (
        <>
            <Button onClick={handleOpen} className="btn-add mx-auto" variant="contained">
                Add Release
            </Button>
            <Dialog
                open={open}
                onClose={handleClose}
                fullWidth
                maxWidth="sm"
                PaperProps={{
                    sx: {
                        borderRadius: '0px',
                        margin: '0',
                        display: 'inline-flex',
                        flexDirection: 'column',
                        position: 'relative',
                        float: 'right',
                    },
                }}
                scroll="body"
            >
                <DialogTitle style={{ textAlign: 'center' }}>Add Release</DialogTitle>
                <DialogContent>
                    <Formik
                        initialValues={{
                            title: '',
                            release_date: '',
                            genre_id: '',
                            release_type: '',
                            bandcamp_link: '',
                            beatport_link: '',
                            spotify_link: '',
                            apple_music_link: '',
                            youtube_link: '',
                            soundcloud_link: '',
                            artist_id: [], // Use artist_id instead of artist_id
                        }}
                        validationSchema={validationSchema}
                        onSubmit={onSubmit}
                    >
                        {({ isSubmitting, setFieldValue }) => (
                            <Form>
                                <Stack spacing={2} margin={2}>
                                    <Field name="title">
                                        {({ field, form }) => (
                                            <TextField
                                                {...field}
                                                label="Title"
                                                variant="outlined"
                                                error={form.errors.title && form.touched.title}
                                                helperText={form.errors.title && form.touched.title && form.errors.title}
                                            />
                                        )}
                                    </Field>
                                    <Field name="release_date">
                                        {({ field, form }) => (
                                            <TextField
                                                {...field}
                                                variant="outlined"
                                                type="date"
                                                error={form.errors.release_date && form.touched.release_date}
                                                helperText={form.errors.release_date && form.touched.release_date && form.errors.release_date}
                                            />
                                        )}
                                    </Field>
                                    <Field name="genre_id">
                                        {({ field, form }) => (
                                            <TextField
                                                {...field}
                                                select
                                                label="Genre"
                                                variant="outlined"
                                                error={form.errors.genre_id && form.touched.genre_id}
                                                helperText={form.errors.genre_id && form.touched.genre_id && form.errors.genre_id}
                                                onChange={(e) => setFieldValue('genre_id', e.target.value)}
                                            >
                                                {genres.map((genre) => (
                                                    <MenuItem key={genre.id} value={genre.id}>
                                                        {genre.name}
                                                    </MenuItem>
                                                ))}
                                            </TextField>
                                        )}
                                    </Field>
                                    <Field name="artist_id">
                                        {({ field, form }) => (
                                            <TextField
                                                {...field}
                                                select
                                                label="Artist"
                                                variant="outlined"
                                                error={Boolean(form.errors.artist_id && form.touched.artist_id)}
                                                helperText={form.errors.artist_id && form.touched.artist_id && form.errors.artist_id}
                                                onChange={(e) => {
                                                    const selectedIds = e.target.value
                                                    setFieldValue('artist_id', selectedIds)
                                                }}
                                                SelectProps={{
                                                    multiple: true,
                                                    value: field.value || [],
                                                    onChange: (e) => {
                                                        const selectedIds = e.target.value
                                                        setFieldValue('artist_id', selectedIds)
                                                    },
                                                    renderValue: (selected) => (
                                                        <div>
                                                            {selected.map(id => (
                                                                <MenuItem key={id} value={id}>
                                                                    {artists.find(artist => artist.id === id)?.artist_name}
                                                                </MenuItem>
                                                            ))}
                                                        </div>
                                                    ),
                                                }}
                                            >
                                                {artists.map((artist) => (
                                                    <MenuItem key={artist.id} value={artist.id}>
                                                        {artist.artist_name}
                                                    </MenuItem>
                                                ))}
                                            </TextField>
                                        )}
                                    </Field>
                                    <FileUploadRelease />
                                    <Field name="bandcamp_link">
                                        {({ field }) => (
                                            <TextField {...field} label="Bandcamp Link" variant="outlined" />
                                        )}
                                    </Field>
                                    <Field name="beatport_link">
                                        {({ field }) => (
                                            <TextField {...field} label="Beatport Link" variant="outlined" />
                                        )}
                                    </Field>
                                    <Field name="spotify_link">
                                        {({ field }) => (
                                            <TextField {...field} label="Spotify Link" variant="outlined" />
                                        )}
                                    </Field>
                                    <Field name="apple_music_link">
                                        {({ field }) => (
                                            <TextField {...field} label="Apple Music Link" variant="outlined" />
                                        )}
                                    </Field>
                                    <Field name="youtube_link">
                                        {({ field }) => (
                                            <TextField {...field} label="Youtube Link" variant="outlined" />
                                        )}
                                    </Field>
                                    <Field name="soundcloud_link">
                                        {({ field }) => (
                                            <TextField {...field} label="Soundcloud Link" variant="outlined" />
                                        )}
                                    </Field>
                                    <Button className="btn-add" type="submit" variant="contained" color="success" disabled={isSubmitting}>
                                        {isSubmitting ? 'Adding...' : 'Add'}
                                    </Button>
                                    {error && <div style={{ color: 'red' }}>{error}</div>}
                                </Stack>
                            </Form>
                        )}
                    </Formik>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default AddReleaseForm
