import React from 'react';
import { Polyline } from '@react-google-maps/api';

export const PolyLineComponent = (route) => {
    return (
        <Polyline
            path={route.coordinates}
            options={{
                strokeColor: '#FF0000',
                strokeOpacity: 1.0,
                strokeWeight: 2,
            }}
        />
    )
};