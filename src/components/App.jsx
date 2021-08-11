import React from 'react';
// import '../styles/bootstrap.scss';
import '../styles/App.scss';
import axios from 'axios';
import swal from '@sweetalert/with-react';
import {Modal} from 'react-responsive-modal';
import $ from 'jquery';

class App extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            args: props.args,
            token: null,
            isModalOpen: false,
            formData: {
                fullName: '',
                email: '',
                phone: '',
                company: '',
                comment: ''
            },
            isRequestQuoteActive: props.args.isActive === true,
            CartContent: null,
            CartLastData: [],
            CurrentCartId: null,
            firstLoaded: false
        }

    }


    componentDidMount() {
        this.setState({token: this.state.args.storefrontToken});
        this.setState({firstLoaded: true});
        // this.getCartContent('didMount');

        // let labelSize = $('.cart-total-label').length;
        // let labelItem = $('.cart-total-label');
        // for (let i = 0; i < labelSize; i++) {
        //     if (labelItem[i].textContent.trim().match(/subtotal/gi) !== null) {
        //         labelItem[i].nextElementSibling.classList.add('subTotalValue');
        //         window.DOMElementReady('.subTotalValue', () => {
        //             console.log(`%cCart item changed!`, 'color: #208c05');
        //         })
        //     }
        // }
    }

    getCartContent() {
        return axios.get("/api/storefront/carts?include=lineItems.physicalItems.options")

    }


    openModal() {
        this.setState({isModalOpen: true})
    }

    closeModal() {
        this.setState({isModalOpen: false})
    }

    submitRequest() {
        this.getCartContent()
            .then(response => {
                console.log(`%cCart Object is gotten! %o`, 'color:#ff6600', response.data[0].lineItems.physicalItems)
                if (response.status === 200) {
                    this.setState({CartContent: response.data[0].lineItems.physicalItems})
                }

            })
            .then(() => {
                console.log(this.state)
            });

    }

    inputHandler(fieldName, e) {
        let {formData} = this.state
        formData[fieldName] = e.target.value
        this.setState({formData})
    }

    render() {

        return (
            <div>
                <button onClick={() => {
                    this.openModal()
                }} className={'button button--primary raq-button'}>Request a quote
                </button>
                <Modal open={this.state.isModalOpen} onClose={() => this.closeModal()} center>
                    <div className="raq--Container">
                        <h2>Request a Quote</h2>
                        <div className="content">
                            <p className={'short-info'}>Request a quote these items.</p>
                            <div className="row">
                                <div className="col-lg-6">
                                    <label htmlFor="fullName">
                                        Fullname:
                                        <input type="text" name={'fullName'}
                                               onChange={(e) => this.inputHandler('fullName', e)}/>
                                    </label>
                                </div>
                                <div className="col-lg-6">
                                    <label htmlFor="email">
                                        E-mail Address:
                                        <input type="email" name={'email'}
                                               onChange={(e) => this.inputHandler('email', e)}/>
                                    </label>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-lg-6">
                                    <label htmlFor="phone">
                                        Phone:
                                        <input type="tel" name={'phone'}
                                               onChange={(e) => this.inputHandler('phone', e)}/>
                                    </label>
                                </div>
                                <div className="col-lg-6">
                                    <label htmlFor="company">
                                        Company:
                                        <input type="text" name={'company'}
                                               onChange={(e) => this.inputHandler('company', e)}/>
                                    </label>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-lg-12">
                                    <label htmlFor="comment">
                                        Comment:
                                        <textarea name="comment" id="comment" cols="30" rows="10"
                                                  onChange={(e) => this.inputHandler('comment', e)}/>
                                    </label>
                                    <button onClick={() => this.submitRequest()} className={'submit-button'}>Submit
                                        Request
                                    </button>
                                </div>

                            </div>
                        </div>

                    </div>
                </Modal>
            </div>
        )
    }
}

export default App;