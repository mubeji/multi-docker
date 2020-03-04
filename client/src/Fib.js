import React, { Component } from 'react'
import axios from 'axios'

export default class Fib extends Component {
    state = {
        seenIndices: [],
        values: {},
        index: ''
    }

    componentDidMount() {
        this.fetchValues()
        this.fetchIndices()
    }

    fetchValues = async () => {
        console.log('fetchValues called!!')
        const values = await axios.get('/api/values/current')
        this.setState({
            values: values.data
        })
    }

    // Gets data from postgres
    fetchIndices = async () => {
        console.log('fetchIndeces called!!')
        const seenIndices = await axios.get('/api/values/all')
        console.log(seenIndices.data)
        this.setState({
            seenIndices: seenIndices.data
        })
    }

    renderSeenIndices = () => {               // .join for comma seperation
        return this.state.seenIndices.map(({ number }) => number).join(', ')
    }

    // Using redis data
    renderValues = () => {
        const items = []
        for (let i in this.state.values) {
            items.push(
                <div key={i}>
                    For index {i} i calculated {this.state.values[i]}
                </div>
            )
        }
        console.log(items)
        return items
    }

    handleChange = (e) => {
        this.setState({
            index: e.target.value
        })
    }

    handleSubmit = async (e) => {
        console.log('submitted!!', this.state.seenIndices)
        // Prevent for from submitting itself
        e.preventDefault()
        // Send data
        await axios.post('/api/values', {
            index: this.state.index
        })
        // Clear input bux
        this.setState({ index: '' })
    }


    render() {
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    <label htmlFor="">Enter your index</label>
                    <input type="text" 
                        name="" 
                        id=""
                        value={this.state.index}
                        onChange={this.handleChange}
                    />
                    <button>Submit</button>
                </form>
                <h3>Seen indices</h3>
                {this.renderSeenIndices()}

                <h3>Calculated values</h3>
                {this.renderValues()}
            </div>
        )
    }
}
