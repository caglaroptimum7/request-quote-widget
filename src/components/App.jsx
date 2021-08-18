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
            validation: {
                fullNameValid: false,
                emailValid: false,
                phoneValid: false,
                companyValid: false
            },
            isRequestQuoteHiden: true,
            CartContent: null,
            CartLastData: [],
            CurrentCartId: null,
            firstLoaded: false,
            comesFromQuote: false,
            quoteObject: null,
            apiUrl: props.apiUrl,
            cartRemoveOnSuccess: props.args.cartRemoveOnSuccess === "true" ? true : false
        }
    }


    componentDidMount() {
        this.setState({token: this.state.args.storefrontToken});

        if (this.props.itComesFromQuote.status) {
            this.setState({comesFromQuote: true});
            this.setState({quoteObject: this.props.itComesFromQuote.data});
        } else {
            this.setState({comesFromQuote: false});
            this.setState({quoteObject: null});
        }

        this.getCartContent()
            .then(response => {
                let cartAmount = response.data[0].cartAmount;
                return parseFloat(cartAmount)

            }).then((cartAmount) => {
            if (this.state.args.isActive === 'true' && parseFloat(this.state.args.minThreshold) <= cartAmount) {
                this.setState({isRequestQuoteHiden: false});
            }

        })

    }

    getCartContent() {
        return axios.get("/api/storefront/carts?include=lineItems.physicalItems.options")
    }


    openModal() {
        let formData = {
            fullName: '',
                email: '',
                phone: '',
                company: '',
                comment: ''
        }

        let validation =  {
            fullNameValid: false,
                emailValid: false,
                phoneValid: false,
                companyValid: false
        };

        this.setState({formData});
        this.setState({validation});
        this.setState({isModalOpen: true});
    }

    closeModal() {
        this.setState({isModalOpen: false})
    }

    submitRequest() {
        let {formData,validation} = this.state;


        if (this.state.validation.fullNameValid && this.state.validation.emailValid && this.state.validation.phoneValid && this.state.validation.companyValid) {

            this.getCartContent()
                .then(response => {
                    console.log(`%cCart Object is gotten! %o`, 'color:#ff6600', response.data[0].lineItems.physicalItems)
                    if (response.status === 200) {
                        this.setState({CartContent: response.data[0].lineItems.physicalItems})
                        this.setState({cartId: response.data[0].id})
                    }
                })
                .then(() => {
                    // console.log(this.state);
                    let StringifyData = {
                        Customer: this.state.formData,
                        Cart: this.state.CartContent,
                        DiscountPercentage: null
                    }
                    let config = {
                        "url": this.state.apiUrl,
                        "method": "POST",
                        "headers": {},
                        "data": StringifyData
                    }
                    axios(config)
                        .then((response) => {
                            console.log(`%c[API Response Content]: %o`, 'color:#ff0000', response);
                            if (response.data.success) {
                                if (this.state.cartRemoveOnSuccess) {
                                    swal({
                                        text: "Your quote request has been sent successfully!",
                                        icon: 'success',
                                        buttons: {
                                            confirm: 'Clear Cart',
                                            cancel: "Close",
                                        }
                                    }).then((value) => {
                                        if (value) {
                                            axios.delete(`/api/storefront/carts/${this.state.cartId}`)
                                                .then((response) => {
                                                    console.log(`%c[CART Delete Response]: %o`, 'color:#000055', response);
                                                    window.location.reload();
                                                })
                                        } else {
                                            this.closeModal();
                                        }
                                    })
                                } else {
                                    swal({
                                        text: "Your quote request has been sent successfully!",
                                        icon: 'success',
                                        buttons: {
                                            cancel: "Close",
                                        }
                                    }).then((value) => {
                                        if (!value) {
                                            this.closeModal();
                                        }
                                    })
                                }

                            } else {
                                throw Error(response.data);
                            }

                        })
                        .catch((err) => {
                            swal({
                                text: err,
                                icon: 'error',
                                buttons: {
                                    cancel: "Close",
                                }
                            })
                        })
                });
        }else {
            if (!this.state.validation.fullNameValid) {
                $('[name="fullName"]').addClass('invalid')
                $('[name="fullName"]').removeClass('valid')
            }
            if (!this.state.validation.emailValid) {
                $('[name="email"]').addClass('invalid')
                $('[name="email"]').removeClass('valid')
            }
            if (!this.state.validation.phoneValid) {
                $('[name="phone"]').addClass('invalid')
                $('[name="phone"]').removeClass('valid')
            }
            if (!this.state.validation.companyValid) {
                $('[name="company"]').addClass('invalid')
                $('[name="company"]').removeClass('valid')
            }
        }


    }

    inputHandler(fieldName, e) {
        let {formData, validation} = this.state;
        if (fieldName === 'email') {
            let regex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
            if (e.target.value.match(regex) === null) {
                $('[name="email"]').addClass('invalid')
            } else {
                $('[name="email"]').removeClass('invalid')
                $('[name="email"]').addClass('valid')
                validation['emailValid'] = true;
                this.setState({validation})
            }
        }
        else if (fieldName === 'fullName') {
            if (e.target.value!=='') {
                $('[name="fullName"]').removeClass('invalid')
                $('[name="fullName"]').addClass('valid')
                validation['fullNameValid'] = true;
                this.setState({validation})
            }else {
                $('[name="fullName"]').addClass('invalid')
                $('[name="fullName"]').removeClass('valid')
            }
        }
        else if (fieldName === 'phone') {
            if (e.target.value!=='' && e.target.value.match(/^\d{10}$/)!==null) {
                $('[name="phone"]').removeClass('invalid')
                $('[name="phone"]').addClass('valid')
                validation['phoneValid'] = true;
                this.setState({validation})
            }else {
                $('[name="phone"]').addClass('invalid')
                $('[name="phone"]').removeClass('valid')
            }
        }
        else if (fieldName === 'company') {
            if (e.target.value!=='') {
                $('[name="company"]').removeClass('invalid')
                $('[name="company"]').addClass('valid')
                validation['companyValid'] = true;
                this.setState({validation})
            }else {
                $('[name="company"]').addClass('invalid')
                $('[name="company"]').removeClass('valid')
            }
        }
        formData[fieldName] = e.target.value
        this.setState({formData})
    }

    render() {
        return (
            <div>
                <button hidden={this.state.isRequestQuoteHiden} onClick={() => {
                    this.openModal()
                }} className={'button button--primary raq-button'}>Request a quote
                </button>
                <Modal open={this.state.isModalOpen} onClose={() => this.closeModal()} center>
                    <div className="raq--Container">
                        <h2>Request a Quote</h2>
                        <div className="content">
                            <p className={'short-info'}><span>We'd like to try and help you get a better deal! <br/>
                        We can often negotiate with our vendors on large orders, or find a lower shipping cost.<br/>
                        Please complete the form below and we will get back to you ASAP.<br/>
                        Thank you for considering. </span></p>
                            <div className="row">
                                <div className="col-lg-6">
                                    <label htmlFor="fullName">
                                        Fullname:
                                        <input type="text" name={'fullName'} placeholder={"John Doe"}
                                               onChange={(e) => this.inputHandler('fullName', e)} required={true}/>
                                    </label>
                                </div>
                                <div className="col-lg-6">
                                    <label htmlFor="email">
                                        E-mail Address:
                                        <input type="email" name={'email'}
                                               pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"
                                               onChange={(e) => this.inputHandler('email', e)} placeholder={"name@email.com"} required={true}/>
                                    </label>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-lg-6">
                                    <label htmlFor="phone">
                                        Phone:
                                        <input type="tel" name={'phone'}
                                               onChange={(e) => this.inputHandler('phone', e)} placeholder={"XXXXXXXXXX"} required={true}/>
                                    </label>
                                </div>
                                <div className="col-lg-6">
                                    <label htmlFor="company">
                                        Company:
                                        <input type="text" name={'company'} placeholder={"Company Inc."}
                                               onChange={(e) => this.inputHandler('company', e)} required={true}/>
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