import React from 'react';

class Skeleton extends React.Component{
    render (){
        const { height,className} = this.props;
        return <div className={className} style={{height:height+'px',background:'#fff',width:'100%',borderRadius:'4px'}}></div>
        
    }
}

export default Skeleton;