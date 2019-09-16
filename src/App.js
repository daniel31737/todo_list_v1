import React, { Component } from 'react';
import './style.scss';

export default class App extends Component {
    constructor() {
        super();
        this.state = {
            items      : {},
            value      : '',
            currentItem: {},
            currentPage: 1,
            newsPerPage: 4
        }
    }
    // onChange event get value input
    handleChange = (e) => {
        const value = e.target.value;
        this.setState({
            value
        })
    }
    // event add new object
    addNewItem = () => {
        const { 
            value, 
            items,
        } = this.state;

        if(value === '' || value === null) {
            alert('Không được để trống!');
        } else {
            const newObject = {
                id: Object.values(items).length + 1,
                value: value,
                isDone: false,
                isUpdate: false
            }
            this.setState({
                items: {
                    ...items,
                    [newObject.id]: newObject
                },
                value: ''
            });
        }
        localStorage.setItem('items', JSON.stringify(items));
    }
    //event edit value of items
    updateValueOfItem = () => {
        const { 
            value, 
            currentItem, 
            items,
        } = this.state;

        const item = items[currentItem.id];
        item.value = value;
        item.isUpdate = !item.isUpdate;

        this.setState({
            items: {
                ...items,
                [currentItem.id]: item
            },
            value: ''
        })
        localStorage.setItem('items', JSON.stringify(items));
    }
    // event done task
    onRemoveItem = (id) => {
        const item = this.state.items[id];
        item.isDone = !item.isDone;

        this.setState({
            items: this.state.items
        })
    }
    // event set status isUpdate then show button edit
    onEditItem = (id) => {
        const item = this.state.items[id];
        item.isUpdate = !item.isUpdate;
        if(item.isUpdate){
            this.setState({
                currentItem: item,
                value: item.value
            })
        } else {
            this.setState({
                currentItem: item,
                value: ''
            })
        }
    }
    // event cannel process edit
    onCancelItem = (id) => {
        const item = this.state.items[id];
        item.isUpdate = !item.isUpdate;

        this.setState({
            currentItem: item,
            value: ''
        })
    }
    // chose page by option
    chosePage = (event) => {
        this.setState({
            currentPage: Number(event.target.id || null)
        });
    }

    showListItem = () => {
        const { 
            items, 
            currentPage, 
            newsPerPage 
        } = this.state;

        const indexOfLastNews = currentPage * newsPerPage;        // index last news
        const indexOfFirstNews = indexOfLastNews - newsPerPage;   // index first news
        const arrayItemConvert = Object.values(items);            // convert list object to array
        const currentTodos = arrayItemConvert.slice(indexOfFirstNews, indexOfLastNews);
        const elementItem = currentTodos.map((value, index) => {
            var todoClass = value.isDone ? "done" : "undone";
            return (
                <li key={index}>
                    <div className={todoClass}>
                        {value.value}
                        <button className="glyphicon glyphicon-remove" onClick={() => this.onRemoveItem(value.id)}></button>
                        <button className="glyphicon glyphicon-pencil" onClick={() => this.onEditItem(value.id)}></button>
                    </div>
                </li>
            ) 
        })
        return elementItem;
    }

    insertPageNumber = () => {
        const { 
            items, 
            newsPerPage, 
            currentPage,
        } = this.state;

        const arrayItemConvert = Object.values(items);
        const pageNumbers = [];
        for (let indexPage = 1; indexPage <= Math.ceil(arrayItemConvert.length / newsPerPage); indexPage++) {   
            pageNumbers.push(indexPage);
        }

        const result = pageNumbers.map(number => {
            if (currentPage === number) {
                if (arrayItemConvert.length > 4) {
                    return (
                        <li key={number} id={number} className="active">
                            {number}
                        </li>
                    )
                }
                return null;
            }
            else {
                return (
                    <li key={number} id={number} onClick={this.chosePage} >
                        {number}
                    </li>
                )
            }
        })
        return result;
    }

    onChangeButton = () => {
        const { currentItem } = this.state;
        if(currentItem.isUpdate){
            return ( 
                <>
                    <button className="btn-submit" onClick={this.updateValueOfItem}>Edit</button>
                    <button className="btn-cancel" onClick={() => this.onCancelItem(currentItem.id)}>Cancel</button>
                </>
            )
        }
        return <button className="btn-submit" type="button" onClick={this.addNewItem}>Add</button>
    }

    componentDidMount() {
        let checkExist = localStorage.getItem('items');
        let items = checkExist ? JSON.parse(localStorage.getItem('items')) : '';
        
        this.setState({
            items: items
        })
    }

    render() {
        const { value } = this.state;
        return (
            <div className="container">
                <div className="row">
                    <div className="col-md-2" />
                    <div className="col-md-8">
                        <div className="content">
                            <div className="title">
                                <h1>Todo List</h1>
                            </div>
                            <div className="form-submit">
                                <input className="input" type="text" onChange={this.handleChange} value={value} />
                                {this.onChangeButton()}
                            </div>
                            <div className="list-item">
                                <ul>
                                    {this.showListItem()}
                                </ul>
                            </div>
                            <div className="pagination-custom">
                                <ul id="page-numbers">
                                    {this.insertPageNumber()}
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-2" />
                </div>
            </div>
        );
    }
}
