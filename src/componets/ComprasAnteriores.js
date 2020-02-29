import React, { Component } from 'react';
import { Icon,  Table, Popconfirm, Button } from 'antd';

const Column = Table.Column;


class ComprasAnteriores extends Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }

    render(){
        return (
            <Table dataSource={this.props.data} pagination={true} size='middle' rowKey="id"
            bordered={true} scroll={{x:'max-content'}}
            expandedRowRender={record => <React.Fragment> 
                                            <Table dataSource={record.itemes} pagination={false} size='small' bordered={true} rowKey="description" scroll={{x:'max-content'}}>
                                                <Column align='center' key='description' title='Descripcion' dataIndex='description' />
                                                <Column align='center' key='unit' title='Cantidad' dataIndex='unit' />
                                                <Column align='center' key='value' title='Precio Unitario' dataIndex='value' />
                                                <Column align='center' key='totalUnit' title='Total Item' render={data => {
                                                    return   Number.parseFloat((data.unit * data.value).toFixed(2));      
                                                }} />
                                            </Table>
                                        </React.Fragment>}>
            <Column align='center' key='shopDate' title='Fecha' dataIndex='shopDate' />
            <Column align='center' key='total' title='Total' dataIndex='total' />
          </Table>
        );
    }
    

}

export default ComprasAnteriores;