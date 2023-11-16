import React from 'react'
import { Polyline } from '@react-google-maps/api';

export class PolyLineComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: props.data,
    };
  }

  render(){
    //lấy data
    const pathCoordinates = this.props.data;
    console.log(pathCoordinates)
    return (
        <Polyline
          path={pathCoordinates}
          options={{
            strokeColor: '#FF0000',
            strokeOpacity: 1.0,
            strokeWeight: 2,
          }}
        />
    );
  }
};