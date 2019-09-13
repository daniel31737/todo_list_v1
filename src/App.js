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
            newsPerPage : 4
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
        const { value } = this.state;
        const newObject = {
            id: Object.values(this.state.items).length + 1,
            content: value,
            isDone: false,
            isUpdate: false
        }
        this.setState({
            items: {
                ...this.state.items,
                [newObject.id]: newObject
            },
            value: '',
            total: newObject.id,

        });
        localStorage.setItem('items', JSON.stringify(this.state.items));
    }
    //event edit content
    updateContent = () => {
        const { value, currentItem } = this.state;
        const infoItem = this.state.items[currentItem.id];
        infoItem.content = value;
        infoItem.isUpdate = !infoItem.isUpdate;
        this.setState({
            items: {
                ...this.state.items,
                [currentItem.id]: infoItem
            },
            value: ''
        })
        localStorage.setItem('items', JSON.stringify(this.state.items));
    }
    // event done task
    onRemoveItem = (id) => {
        const infoItem = this.state.items[id];
        infoItem.isDone = !infoItem.isDone;
        this.setState({
            items: this.state.items
        })
    }
    // event set status isUpdate then show button edit
    onEditItem = (id) => {
        const infoItem = this.state.items[id];
        infoItem.isUpdate = !infoItem.isUpdate;
        this.setState({
            currentItem: infoItem,
            value: infoItem.content
        })
    }
    // event cannel process edit
    onCancelItem = (id) => {
        const infoItem = this.state.items[id];
        infoItem.isUpdate = !infoItem.isUpdate;
        this.setState({
            currentItem: infoItem,
            value: ''
        })
    }
    // chose page by option
    chosePage = (event) => {
        this.setState({
            currentPage: Number(event.target.id)
        });
    }

    componentDidMount() {
        let checkExist = localStorage.getItem('items');
        let infoItems = checkExist ? JSON.parse(localStorage.getItem('items')) : '';
        this.setState({
            items: infoItems
        })
    }

    render() {
        const { currentItem, value, items, currentPage, newsPerPage } = this.state;
        const indexOfLastNews = currentPage * newsPerPage;        // Vi tri tin tuc cuoi cung
        const indexOfFirstNews = indexOfLastNews - newsPerPage;   // Vi tri tin tuc dau tien

        const arrayItemConvert = Object.values(items);
        console.log(arrayItemConvert);
        const currentTodos = arrayItemConvert.slice(indexOfFirstNews, indexOfLastNews);
        const elementItem = currentTodos.map((value, index) => {
            var todoClass = value.isDone ? "done" : "undone";
            return  <li key={index}>
                        <div className={todoClass}>
                                {value.content}
                                <button className="glyphicon glyphicon-remove" onClick={() => this.onRemoveItem(value.id)}></button>
                                <button className="glyphicon glyphicon-pencil" onClick={() => this.onEditItem(value.id)}></button>
                        </div>
                    </li>
        })
        const pageNumbers = [];
        for (let indexPage = 1; indexPage <= Math.ceil(arrayItemConvert.length / newsPerPage); indexPage++) {   
            pageNumbers.push(indexPage);
        }

        return (
            <div className="container">
                <div className="row">
                    <div className="col-md-2"></div>
                    <div className="col-md-8">
                        <div className="content">
                            <div className="title">
                                <h1>Todo List</h1>
                            </div>
                            <div className="form-submit">
                                <input className="input" type="text" onChange={this.handleChange} value={value} />
                                {currentItem.isUpdate ?
                                    <div>
                                        <button className="btn-submit" onClick={this.updateContent}>Edit</button>
                                        <button className="btn-cancel" onClick={() => this.onCancelItem(currentItem.id)}>Cancel</button>
                                    </div>
                                    :
                                    <button className="btn-submit" type="button" onClick={this.addNewItem}>Add</button>
                                }
                            </div>
                            <div className="list-item">
                                <ul>
                                    {elementItem}
                                </ul>
                            </div>
                            <div className="pagination-custom">
                                <ul id="page-numbers">
                                    {
                                        pageNumbers.map(number => {
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
                                    }
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-2"></div>
                </div>
            </div>
        );
    }
}
