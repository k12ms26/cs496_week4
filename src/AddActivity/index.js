import React, { useState } from 'react';
import { withFirebase } from '../Firebase';

import { makeStyles } from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Slider from '@material-ui/core/Slider';
import Typography from '@material-ui/core/Typography';
import firebase from 'firebase';

const useStyles = makeStyles(theme => ({
    formControl: {
        minWidth: '100%',
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
}));

function AddActivity(props) {
    const classes = useStyles();

    const { authUser, selectedDay, setOpenSnackbar, setSnackbarMsg } = props;
    const uid = authUser.uid;

    // Set query date for updating database
    selectedDay.year = new Date().getFullYear();
    let queryDate = `${selectedDay.day}-${selectedDay.month}-${selectedDay.year}`;

    // Set default activity object
    const defaultActivity = {
        name: '',
        type: 1,
        duration: 60,
        url: '',
        date: queryDate
    }

    const [activity, setActivity] = useState(defaultActivity);

    const handleChange = e => {
        const { name, value } = e.target
        setActivity({
            ...activity,
            date: queryDate,
            [name]: value
        });
    }


    const handleSlider = e => {
        const duration = e.target.getAttribute('aria-valuenow');
        setActivity({ ...activity, duration: duration });
    }

    const isValid = activity.name === '';

    // Add the activity to firebase via the API made in this app
    const handleSubmit = () => {
        if (authUser) {
            firebase.database().ref(uid).push(activity)
            setActivity(defaultActivity);
            // Show notification
            setOpenSnackbar(true);
            setSnackbarMsg('Added activity');
            setTimeout(() => {
                setOpenSnackbar(false)
            }, 3000)
        }
    }

    return (
        <form noValidate onSubmit={e => e.preventDefault()}>
            <FormControl className={classes.formControl}>
                <TextField
                    style={{ marginTop: '5px' }}
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    label="Activity name"
                    value={activity.name}
                    name="name"
                    onChange={handleChange}
                />

                <div style={{ marginTop: '20px', marginBottom: '30px' }}>
                    <Typography id="discrete-slider" gutterBottom>
                        종류
                    </Typography>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={activity.type}
                        style={{ minWidth: '100%' }}
                        name="type"
                        onChange={handleChange}
                    >
                        <MenuItem value={1}>자소서</MenuItem>
                        <MenuItem value={2}>보고서</MenuItem>
                        <MenuItem value={3}>면접 모의 질문</MenuItem>
                    </Select>
                </div>
                <Typography id="discrete-slider" gutterBottom>
                    중요도
                </Typography>
                <Slider
                    defaultValue={activity.duration}
                    aria-labelledby="discrete-slider"
                    valueLabelDisplay="auto"
                    step={10}
                    marks
                    min={10}
                    max={100}
                    name="duration"
                    onChange={handleSlider}
                    style={{ marginBottom: '20px' }}
                />
            </FormControl>

            <TextField
                style={{ marginTop: '5px' }}
                variant="outlined"
                margin="normal"
                required
                fullWidth
                label="URL(없을 시 . 입력)"
                value={activity.url}
                name="url"
                onChange={handleChange}
            />

            <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                disabled={isValid}
            >
                저장
            </Button>
        </form>
    )
};

export default withFirebase(AddActivity);