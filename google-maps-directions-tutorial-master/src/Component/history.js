import React from 'react';
import { Polyline } from '@react-google-maps/api';

export const HistoryComponent = (history) => {
    return (
        <Polyline
            path={history.coordinates}
            options={{
                strokeColor: '#291acd',
                strokeOpacity: 1.0,
                strokeWeight: 2,
            }}
        />
    )
};