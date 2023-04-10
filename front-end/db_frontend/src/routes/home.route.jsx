import {
    LineChart,
    Line,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    Area,
    AreaChart,
    ResponsiveContainer,
    BarChart, Legend, Bar
} from 'recharts';
import TableComponent from "../components/table.component.jsx";
import NavbarComponent from "../components/navbar.component.jsx";
import {Fragment, useEffect, useState} from "react";
import {MdLunchDining, MdOutlineDirectionsTransit, MdOutlineLocalPharmacy} from "react-icons/md";
import {Button, DialogBody, DialogFooter, DialogHeader, Switch, Dialog} from "@material-tailwind/react";
import {
    BanknotesIcon, CreditCardIcon, CurrencyEuroIcon, DevicePhoneMobileIcon, PhoneIcon,
    ShoppingBagIcon,
    ShoppingCartIcon,
    TrophyIcon
} from "@heroicons/react/24/outline/index.js";
import DatePicker from "react-datepicker";
import LeftComponent from "../components/left.component.jsx";
import {Link, Route, Routes, useLocation} from "react-router-dom";
import {PlusIcon} from "@heroicons/react/20/solid/index.js";
import {useForm} from "react-hook-form";
import axios from "axios";
import "react-datepicker/dist/react-datepicker.css";
import {useCookies} from "react-cookie";
import OfferPartnerComponent from "../components/offer.partner.component.jsx";
import OfferUserComponent from "../components/offer.users.component.jsx";
import CountUp from "react-countup";
import moment from "moment";
import OfferComponent from "../components/offer.component.jsx";

const data = [
    {
        "name": "1",
        "uv": 4000,
        "pv": 2400,
        "amt": 2400
    },
    {
        "name": "2",
        "uv": 3000,
        "pv": 1398,
        "amt": 2210
    },
    {
        "name": "3",
        "uv": 2000,
        "pv": 9800,
        "amt": 2290
    },
    {
        "name": "4",
        "uv": 2780,
        "pv": 3908,
        "amt": 2000
    },
    {
        "name": "5",
        "uv": 1890,
        "pv": 4800,
        "amt": 2181
    },
    {
        "name": "6",
        "uv": 2390,
        "pv": 3800,
        "amt": 2500
    },
    {
        "name": "7",
        "uv": 3490,
        "pv": 4300,
        "amt": 2100
    },
    {
        "name": "8",
        "uv": 3490,
        "pv": 4300,
        "amt": 2100
    },
    {
        "name": "9",
        "uv": 8000,
        "pv": 900,
        "amt": 2100
    }
]

function Card(props) {
    return (
        <button onClick={props.handler}
            className="relative flex flex-col min-w-0 break-words bg-white dark:bg-gray-700 shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out dark:bg-slate-850 dark:shadow-dark-xl rounded-2xl bg-clip-border col-span-1 mt-4">
            <div className="flex-auto p-4">
                <div className="flex flex-row -mx-3">
                    <div className="flex-none w-2/3 max-w-full px-3">
                        <div>
                            <p className="mb-0 font-sans dark:text-gray-300 leading-normal uppercase text-sm text-left">{props.title}</p>
                            <h5 className="mb-2 font-bold dark:text-white text-left">
                                <CountUp
                                    end={props.value}
                                    duration={2}/> RON</h5>
                            <p className="mb-0 dark:text-white dark:opacity-60 text-left">
                                {props.percentage > 0 ? <span className="font-bold leading-normal text-sm text-green-500 dark:text-green-400 text-left">+{props.percentage}{props.percentage !== undefined && "%"}  </span> :
                                    <span className="font-bold leading-normal text-sm text-red-500 dark:text-red-300 text-left">{props.percentage}{props.percentage !== undefined && "%"}  </span>}

                                {props.subtext}
                            </p>
                        </div>
                    </div>
                    <div className="px-3 text-right basis-1/3">
                        <div
                            className="inline-block w-12 h-12 text-center rounded-full bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500">
                            <props.icon  className="h-10 w-10 text-lg relative text-white top-1 left-1"></props.icon>
                        </div>
                    </div>
                </div>
            </div>
        </button>
    )
}

function CreditCard(props) {
    return (
        <div
            className="relative flex flex-col min-w-0 break-words bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-indigo-900 via-indigo-400 to-indigo-900 shadow-xl dark:bg-slate-850 dark:shadow-dark-xl rounded-2xl bg-clip-border col-span-1 mt-4">
            <div className="flex-auto p-4">
                <div className="flex flex-row -mx-3">
                    <div className="flex-none w-2/3 max-w-full px-3">
                        <div>
                            <CreditCardIcon className={"h-6 w-6 left-4 text-white"}/>
                            <p className="mt-4 mb-6 font-bold text-md text-white text-left">{props.details}</p>
                            <p className="mb-0 text-white font-semibold text-left">
                                {props.name}
                            </p>
                            <p className="mb-0 text-white text-left">
                                {props.date}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function AddCard(props) {
    return (
        <button onClick={props.handler}
            className="relative flex flex-col min-w-0 break-words dark:bg-gray-700 bg-white shadow-xl dark:bg-slate-850 dark:shadow-dark-xl rounded-2xl bg-clip-border col-span-1 mt-4">
            <div className="flex m-auto items-center justify-center content-center">
                <PlusIcon className="flex h-16 w-16 text-gray-400 dark:text-white m-auto items-center justify-center content-center"/>
            </div>

        </button>
    )
}

function datetoshow(date) {
    var day = moment(date.substring(0, 10), "YYYY-MM-DD");

    let show = day.toDate();
    let today = new Date();

    if (today.getDay() === show.getDay() && today.getMonth() === show.getMonth()) {
        return "Today";
    } else if (today.getDay() - 1 === show.getDay() && today.getMonth() === show.getMonth()) {
        return "Yesterday"
    }

    return day.day() + "." + day.month();
}

function TransactionCard(props) {
    let Icon_var;
    switch (props.category) {
        case "Food":
            Icon_var = MdLunchDining;
            break;
        case "Gadgets":
            Icon_var = DevicePhoneMobileIcon;
            break;
        case "Medical":
            Icon_var = MdOutlineLocalPharmacy;
            break;
        case "Groceries":
            Icon_var = ShoppingCartIcon;
            break;
        case "Transport":
            Icon_var = MdOutlineDirectionsTransit;
            break;
    }

    let receiver = props.receiver;
    let payer = props.payer;



    // console.log(icon_var);
    if (props.receiver.indexOf('@') !== -1) {
        receiver = props.receiver.substring(0, props.receiver.indexOf('@'));
    }
    if (props.payer !== undefined) {
        if (props.payer.indexOf('@') !== -1) {
            payer = props.payer.substring(0, props.payer.indexOf('@'));
        }
    }


    const [ongoing, setOngoing] = useState(props.isOngoing);

    const pay = () => {
        const data = {
            token: props.token,
            date: props.date
        }

        console.log(data)

        axios.post("http://localhost:8000/pay", data)
            .then((res) => {
                console.log(res.data);
                setOngoing(false);
            })
            .catch(err => {
                console.log(err)
        })
    }

    return (
        <div
            className="relative flex flex-col min-w-0 break-words bg-white dark:bg-gray-700  shadow-xl dark:bg-slate-850 dark:shadow-dark-xl rounded-2xl bg-clip-border col-span-1 mt-4">
            <div className="flex-auto p-4">
                <div className="flex flex-row -mx-3">
                    <div className="flex-none w-2/3 max-w-full px-3">
                        <div>
                            <p className="mb-0 font-sans dark:text-gray-300 leading-normal uppercase text-sm text-left">{props.receiver === props.email ? payer : receiver}</p>
                            <h1 className="mb-2 font-bold dark:text-white text-left"><CountUp
                                end={props.receiver === props.email ? props.amount : -props.amount}
                                duration={2}/>{props.amount !== 0 && " RON"}</h1>
                            <p className="text-gray-400 dark:text-white text-left">{datetoshow(props.date)}</p>
                        </div>
                    </div>
                    <div className="px-3 text-right basis-1/3">
                        <div
                            className="inline-block w-12 h-12 text-center rounded-full bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500">
                            {Icon_var != null && <Icon_var className="h-10 w-10 text-lg relative text-white top-1 left-1"></Icon_var>}
                        </div>
                    </div>
                </div>
                { (props.onGoing || props.intent === "plata") && <div className={"flex justify-end mt-4"}>
                    <Button onClick={pay}>Pay Now</Button>
                </div>}
            </div>
        </div>
    )
}

function SubscriptionCard(props) {
    let Icon_var;
    switch (props.category) {
        case "Food":
            Icon_var = MdLunchDining;
            break;
        case "Gadgets":
            Icon_var = DevicePhoneMobileIcon;
            break;
        case "Medical":
            Icon_var = MdOutlineLocalPharmacy;
            break;
        case "Groceries":
            Icon_var = ShoppingCartIcon;
            break;
        case "Transport":
            Icon_var = MdOutlineDirectionsTransit;
            break;

        default:
            Icon_var = null;
            break;
    }

    // console.log(icon_var);

    return (
        <div
            className="relative flex flex-col min-w-0 break-words bg-white dark:bg-gray-700  shadow-xl dark:bg-slate-850 dark:shadow-dark-xl rounded-2xl bg-clip-border col-span-1 mt-4">
            <div className="flex-auto p-4">
                <div className="flex flex-row -mx-3">
                    <div className="flex-none w-2/3 max-w-full px-3">
                        <div>
                            <p className="mb-0 font-sans dark:text-gray-300 leading-normal uppercase text-sm text-left">{props.receiver}</p>
                            <h1 className="mb-2 font-bold dark:text-white text-left">${props.amount}</h1>
                            <p className="text-gray-400 dark:text-white text-left">Renewal date: {props.date}</p>
                        </div>
                    </div>
                    <div className="px-3 text-right basis-1/3">
                        <div
                            className="inline-block w-12 h-12 text-center rounded-full bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500">
                            {Icon_var != null && <Icon_var className="h-10 w-10 text-lg relative text-white top-1 left-1"></Icon_var>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function HomeRoute() {
    const [open, setOpen] = useState(false);
    const location = useLocation();
    const [cookies, setCookie, removeCookie] = useCookies(['token']);
    const [wallet, setWallet] = useState(null);

    useEffect(() => {
        if (wallet != null) {
            return;
        }
        const send = {
            token: cookies.token.token
        }
        console.log(send);
        axios.post("http://localhost:8000/user/wallet", send)
            .then((res) => {
                console.log(res);
                setWallet(res.data);
                setTransactions(res.data.transactions);
            })
            .catch(err => {
                console.log(err)
            })
    })

    const handleOpen = () => setOpen(!open);
    const [openBudget, setOpenBudget] = useState(false);

    const handleOpenBudget = () => setOpenBudget(!openBudget);

    const [openSidebar, setOpenSidebar] = useState(true);
    const handleOpenSidebar = () => setOpenSidebar(!openSidebar);

    const darkMode = () => {

        // toggle icons inside button

        // if set via local storage previously
        if (localStorage.getItem('color-theme')) {
            if (localStorage.getItem('color-theme') === 'light') {
                document.documentElement.classList.add('dark');
                localStorage.setItem('color-theme', 'dark');
            } else {
                document.documentElement.classList.remove('dark');
                localStorage.setItem('color-theme', 'light');
            }

            // if NOT set via local storage previously
        } else {
            if (document.documentElement.classList.contains('dark')) {
                document.documentElement.classList.remove('dark');
                localStorage.setItem('color-theme', 'light');
            } else {
                document.documentElement.classList.add('dark');
                localStorage.setItem('color-theme', 'dark');
            }
        }
    };

    const [subscription, setSubscriptions] = useState([]);
    const [transactions, setTransactions] = useState([]);

    const { register, handleSubmit } = useForm();

    const onSubmitSubscription = data => {
        console.log(data);
        console.log(location);

        if (openBudget) {
            axios.post("http://localhost:8000/user/edit_budget", {token: cookies.token.token, new_value: parseInt(data.amount)})
                .then((res) => {
                    console.log(res.data)
                    setWallet(null);
                    setOpenBudget(false);
                })
                .catch(err => {
                    console.log(err)
                });
            return;
        }

        const trans = {
            receiver: data.receiver,
            amount: parseFloat(data.amount),
            date: date,
            category: data.category,
            blockchain_hash: " ",
            payer: cookies.token.email,
            intent: data.intent,
        }

        if (location.pathname === "/home/offers/user") {
            const payload = {
                name: cookies.token.email,
                description: data.description,
                cost: parseInt(data.cost),
                category: data.category,
            }

            axios.post("http://localhost:8000/register_user_offer", payload)
                .then((res) => {
                    console.log(res.data)
                }).catch(err => {
                    console.log(err)
            })
            return;
        }

        if (location.pathname === "/home/subscriptions") {
            // subscription.push(data);

            axios.post("http://localhost:8000/admin/set_subscription", trans)
                .then((res) => {
                    console.log(res.data);

                    // subscription.push(data);
                    setWallet(null);
                    handleOpen();
                })
                .catch(err => {
                    console.log(err)
                });
        } else {
            // transactions.push(data);
            console.log(transactions);

            axios.post("http://localhost:8000/admin/send_request", trans)
                .then((res) => {
                    console.log(res.data);

                    // transactions.push(data);
                    console.log(transactions);
                    setWallet(null);
                    handleOpen();
                })
                .catch(err => {
                    console.log(err)
                });
        }


    }

    const [date, setDate] = useState(new Date());

    const handleValueChange = (newValue) => {
        setDate(newValue);
    }

    const transactionMap = () => {
        return transactions.map(elem => { return <TransactionCard token={cookies.token.token} intent={elem.intent} category={elem.category} date={elem.date} amount={elem.amount} receiver={elem.receiver} payer={elem.payer} email={cookies.token.email}/> });
    }

    const spentToday = (data, day) => {
        if (data == null)
            return 0;


        let sum = 0;
        data.forEach(myFunction);

        function myFunction(item) {
            if (datetoshow(item.date) === "Today")
                sum += item.amount;
        }

        return sum;
    }

    return (
        <>
            <Fragment>
                { openSidebar && <LeftComponent/> }
            <NavbarComponent modal={handleOpen} sidebar={handleOpenSidebar} darkmode={darkMode} tokens={wallet}/>
                <Dialog open={openBudget} handler={handleOpenBudget} size="xs">
                    <div className="relative p-4 w-full max-w-2xl h-full md:h-auto dark:bg-gray-800">
                        <div
                            className="flex justify-between items-center pb-4 mb-4 rounded-t border-b sm:mb-5 dark:border-gray-600">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                Update Budget
                            </h3>
                            <button type="button" onClick={handleOpenBudget}
                                    className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
                                    >
                                <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"
                                     xmlns="http://www.w3.org/2000/svg">
                                    <path fill-rule="evenodd"
                                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                          clip-rule="evenodd"></path>
                                </svg>
                                <span className="sr-only">Close modal</span>
                            </button>
                        </div>
                        <form onSubmit={handleSubmit(onSubmitSubscription)}>
                            <div>
                                <label htmlFor="price"
                                       className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Budget</label>
                                <input type="number" name="price" id="price"
                                       className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                       placeholder="$2999" required=""
                                       {...register("amount", {required: true})}/>
                            </div>
                            <button type="submit"
                                    className="mt-8 text-white inline-flex items-center bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
                                <svg className="mr-1 -ml-1 w-6 h-6" fill="currentColor" viewBox="0 0 20 20"
                                     xmlns="http://www.w3.org/2000/svg">
                                    <path fill-rule="evenodd"
                                          d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                                          clip-rule="evenodd"></path>
                                </svg>
                                Set new budget
                            </button>
                        </form>
                    </div>
                </Dialog>

                <Routes>
                    <Route path="/" element={
                        <>
                            <Dialog open={open} handler={handleOpen} size="sm">
                                <div className="relative p-4 w-full max-w-2xl h-full md:h-auto dark:bg-gray-800">

                                    <div
                                        className="flex justify-between items-center pb-4 mb-4 rounded-t border-b sm:mb-5 dark:border-gray-600">
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                            Add Transaction
                                        </h3>
                                        <button type="button" onClick={handleOpen}
                                                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
                                                data-modal-toggle="defaultModal">
                                            <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"
                                                 xmlns="http://www.w3.org/2000/svg">
                                                <path fill-rule="evenodd"
                                                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                                      clip-rule="evenodd"></path>
                                            </svg>
                                            <span className="sr-only">Close modal</span>
                                        </button>
                                    </div>
                                    <form onSubmit={handleSubmit(onSubmitSubscription)}>
                                        <div className="grid gap-4 mb-4 sm:grid-cols-2">
                                            <div>
                                                <label htmlFor="name"
                                                       className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Name</label>
                                                <input type="text" name="name" id="name"
                                                       className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                                       placeholder="Type the persons name" required="" {...register("receiver", {required: false})}/>
                                            </div>
                                            <div>
                                                <label htmlFor="price"
                                                       className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Transaction date</label>
                                                <DatePicker
                                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                                    selected={date} onChange={(date) => handleValueChange(date)} />
                                            </div>
                                            <div>
                                                <label htmlFor="price"
                                                       className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Price</label>
                                                <input type="number" name="price" id="price"
                                                       className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                                       placeholder="$2999" required=""
                                                       {...register("amount", {required: false})}/>
                                            </div>
                                            <div>
                                                <label htmlFor="category"
                                                       className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Category</label>
                                                <select id="category"
                                                        {...register("category", {required: false})}
                                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">
                                                    <option selected="">Select category</option>
                                                    <option value="Groceries">Groceries</option>
                                                    <option value="Transport">Transport</option>
                                                    <option value="Food">Food</option>
                                                    <option value="Gadgets">Gadgets</option>
                                                    <option value="Medical">Medical</option>
                                                    <option value="PH">Phones</option>
                                                </select>
                                            </div>
                                            <div className="sm:col-span-2">
                                                <label htmlFor="description"
                                                       className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Description</label>
                                                <textarea id="description" rows="4"
                                                          className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                                          placeholder="Write product description here" {...register("intent")}></textarea>
                                            </div>
                                        </div>
                                        <button type="submit"
                                                className="text-white inline-flex items-center bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
                                            <svg className="mr-1 -ml-1 w-6 h-6" fill="currentColor" viewBox="0 0 20 20"
                                                 xmlns="http://www.w3.org/2000/svg">
                                                <path fill-rule="evenodd"
                                                      d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                                                      clip-rule="evenodd"></path>
                                            </svg>
                                            Add new transaction
                                        </button>
                                    </form>
                                </div>
                            </Dialog>
                            <div className={"grid grid-cols-4 gap-4 px-32 pt-16 " + (openSidebar ? " ml-36" : " ")}>
                                <div className="overflow-y-auto col-span-1 px-4">
                                    { transactionMap() }
                                </div>
                                <div className="col-span-3 grid grid-cols-4 col-start-2 gap-4 w-full grid-rows-4">

                                    <Card icon={ShoppingBagIcon} title={"Amount spent today"} percentage={24} subtext={"since Yesterday"} value={wallet != null && spentToday(wallet.transactions, "Today")} />
                                    <Card icon={ShoppingCartIcon} title={"Amount spent this week"} percentage={-69} subtext={"since last week"} value={wallet != null && spentToday(wallet.transactions, "Yesterday")} />
                                    <Card icon={BanknotesIcon} title={"Budget for the month"} percentage={24} subtext={"since last month"} value={wallet != null && wallet.expected_budget} handler={handleOpenBudget}/>
                                    <Card icon={TrophyIcon} title={"Earned this month"} percentage={50} subtext={"since last month"} value={7000} />

                                    <div className="w-full max-w-full mt-4 lg:flex-none col-span-2 row-span-2 shadow-xl rounded-2xl">
                                        <div
                                            className="relative z-20 h-full flex flex-col min-w-10 break-words bg-white dark:bg-gray-700 border-0 border-solid border-black-125 shadow-soft-xl dark:shadow-soft-dark-xl rounded-2xl bg-clip-border">
                                            <ResponsiveContainer width={"100%"} height={"100%"}>
                                                <AreaChart data={data}
                                                           margin={{ top: 10, right: 32, left: 32, bottom: 16 }}>
                                                    <defs>
                                                        <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                                                            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                                                            <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                                                        </linearGradient>
                                                        <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                                                            <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                                                            <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
                                                        </linearGradient>
                                                    </defs>
                                                    <Tooltip />
                                                    <XAxis dataKey="name" />
                                                    <Area type="monotone" dataKey="uv" stroke="#8884d8" fillOpacity={1} fill="url(#colorUv)" />
                                                    <Area type="monotone" dataKey="pv" stroke="#82ca9d" fillOpacity={1} fill="url(#colorPv)" />
                                                </AreaChart>
                                            </ResponsiveContainer>
                                            <div className="px-8 mb-4">
                                                <h1 className="text-left text-white font-bold ">Money spent this month</h1>
                                                <p className="text-left dark:text-white text-gray-800">April</p>
                                                <p className="mb-0 dark:text-white dark:opacity-60 text-left">
                                                    {75 > 0 ? <span className="font-bold leading-normal text-sm text-red-500 dark:text-red-400 text-left">+75%  </span> :
                                                        <span className="font-bold leading-normal text-sm text-green-500 dark:text-green-200 text-left">-75%  </span>}

                                                    more than last month
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <CreditCard details={wallet != null ? wallet.personal_num : ""} name={wallet != null ? wallet.name : ""} date={"7/24"}/>
                                    <AddCard handler={handleOpen}/>
                                    <div className="w-full max-w-full mt-4 lg:flex-none col-span-2 row-span-2 shadow-xl rounded-2xl">
                                        <div
                                            className="relative z-20 h-full flex flex-col min-w-10 break-words bg-white dark:bg-gray-700 border-0 border-solid border-black-125 shadow-soft-xl dark:shadow-soft-dark-xl rounded-2xl bg-clip-border p-4">
                                            <ResponsiveContainer width={"100%"} height={"100%"}>
                                                <BarChart data={data} margin={{ top: 10, right: 32, left: 32, bottom: 16 }} className=" z-20 bg-gray-700 dark:bg-gray-200 border-0 border-solid border-black-125 shadow-soft-xl dark:shadow-soft-dark-xl rounded-2xl bg-clip-border ">
                                                    <defs>
                                                        <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                                                            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                                                            <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                                                        </linearGradient>
                                                        <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                                                            <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                                                            <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
                                                        </linearGradient>
                                                    </defs>
                                                    <XAxis dataKey="name" />
                                                    <Tooltip />
                                                    <Legend />
                                                    <Bar dataKey="pv" fill="#8884d8" barSize={20} radius={[10, 10, 0, 0]}/>
                                                </BarChart>
                                            </ResponsiveContainer>
                                            <div className="px-8 mb-4 mt-4">
                                                <h1 className="text-left text-white font-bold ">Money spent this week</h1>
                                                <p className="text-left dark:text-white text-gray-800">02-09 April</p>
                                                <p className="mb-0 dark:text-white dark:opacity-60 text-left">
                                                    {-75 > 0 ? <span className="font-bold leading-normal text-sm text-red-500 dark:text-red-400 text-left">+75%  </span> :
                                                        <span className="font-bold leading-normal text-sm text-green-500 dark:text-green-200 text-left">-75%  </span>}

                                                    more than last week
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    {/*<OfferComponent classname={"row-span-1"} partner_name={"Google"} price={10} num={4} category={"Food"} description={""}/>*/}
                                </div>
                        </div>
                        </>
                    }/>
                    <Route path="/subscriptions" element={
                        <>
                            <Dialog open={open} handler={handleOpen} size="sm">
                                <div className="relative p-4 w-full max-w-2xl h-full md:h-auto dark:bg-gray-800">

                                    <div
                                        className="flex justify-between items-center pb-4 mb-4 rounded-t border-b sm:mb-5 dark:border-gray-600">
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                            Add Subscription
                                        </h3>
                                        <button type="button" onClick={handleOpen}
                                                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
                                                data-modal-toggle="defaultModal">
                                            <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"
                                                 xmlns="http://www.w3.org/2000/svg">
                                                <path fill-rule="evenodd"
                                                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                                      clip-rule="evenodd"></path>
                                            </svg>
                                            <span className="sr-only">Close modal</span>
                                        </button>
                                    </div>
                                    <form onSubmit={handleSubmit(onSubmitSubscription)}>
                                        <div className="grid gap-4 mb-4 sm:grid-cols-2">
                                            <div>
                                                <label htmlFor="name"
                                                       className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Name</label>
                                                <input type="text" name="name" id="name"
                                                       className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                                       placeholder="Type product name" required="" {...register("receiver", {required: false})}/>
                                            </div>
                                            <div>
                                                <label htmlFor="price"
                                                       className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Transaction date</label>
                                                <DatePicker
                                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                                    selected={date} onChange={(date) => handleValueChange(date)} />
                                            </div>
                                            <div>
                                                <label htmlFor="price"
                                                       className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Price</label>
                                                <input type="number" name="price" id="price"
                                                       className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                                       placeholder="$2999" required="" {...register("amount", {required: false})}/>
                                            </div>
                                            <div>
                                                <label htmlFor="category"
                                                       className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Category</label>
                                                <select id="category"
                                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                                        {...register("category", {required: false})}>
                                                    <option selected="">Select category</option>
                                                    <option value="TV">TV/Monitors</option>
                                                    <option value="PC">PC</option>
                                                    <option value="GA">Gaming/Console</option>
                                                    <option value="PH">Phones</option>
                                                </select>
                                            </div>
                                            <div className="sm:col-span-2">
                                                <label htmlFor="description"
                                                       className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Description</label>
                                                <textarea id="description" rows="4"
                                                          className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                                          placeholder="Write product description here" {...register("intent", {required: false})}></textarea>
                                            </div>
                                        </div>
                                        <button type="submit"
                                                className="text-white inline-flex items-center bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
                                            <svg className="mr-1 -ml-1 w-6 h-6" fill="currentColor" viewBox="0 0 20 20"z
                                                 xmlns="http://www.w3.org/2000/svg">
                                                <path fill-rule="evenodd"
                                                      d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                                                      clip-rule="evenodd"></path>
                                            </svg>
                                            Add new subscription
                                        </button>
                                    </form>
                                </div>
                            </Dialog>
                            <h1 className="px-32 ml-36 text-left text-white text-3xl">Total per month: <span className="font-bold text-gray-200">5000 </span></h1>
                            <div className={"grid grid-cols-5 gap-4 px-32 pt-16 " + (openSidebar ? " ml-36" : " ")}>
                                {subscription.map(item => {

                                })}
                                <AddCard className="col-span-1" handler={handleOpen}/>
                            </div>
                        </>
                    }/>
                    <Route path="/offers/partner" element={
                        <>
                            <OfferPartnerComponent openSider={openSidebar} setWallet={setWallet}/>
                        </>
                    }/>
                    <Route path="/offers/user" element={
                        <>
                            <Dialog open={open} handler={handleOpen} size="sm">
                                <div className="relative p-4 w-full max-w-2xl h-full md:h-auto dark:bg-gray-800">

                                    <div
                                        className="flex justify-between items-center pb-4 mb-4 rounded-t border-b sm:mb-5 dark:border-gray-600">
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                            Add User Offer
                                        </h3>
                                        <button type="button" onClick={handleOpen}
                                                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
                                                data-modal-toggle="defaultModal">
                                            <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"
                                                 xmlns="http://www.w3.org/2000/svg">
                                                <path fill-rule="evenodd"
                                                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                                      clip-rule="evenodd"></path>
                                            </svg>
                                            <span className="sr-only">Close modal</span>
                                        </button>
                                    </div>
                                    <form onSubmit={handleSubmit(onSubmitSubscription)}>
                                        <div className="grid gap-4 mb-4 sm:grid-cols-2">
                                            {/*<div>*/}
                                            {/*    <label htmlFor="name"*/}
                                            {/*           className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Name</label>*/}
                                            {/*    <input type="text" name="name" id="name"*/}
                                            {/*           className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"*/}
                                            {/*           placeholder="Type the persons name" required="" {...register("name", {required: false})}/>*/}
                                            {/*</div>*/}
                                            {/*<div>*/}
                                            {/*    <label htmlFor="price"*/}
                                            {/*           className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Transaction date</label>*/}
                                            {/*    <DatePicker*/}
                                            {/*        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"*/}
                                            {/*        selected={date} onChange={(date) => handleValueChange(date)} />*/}
                                            {/*</div>*/}
                                            <div>
                                                <label htmlFor="price"
                                                       className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Price</label>
                                                <input type="number" name="price" id="price"
                                                       className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                                       placeholder="$2999" required=""
                                                       {...register("cost", {required: false})}/>
                                            </div>
                                            <div>
                                                <label htmlFor="category"
                                                       className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Category</label>
                                                <select id="category"
                                                        {...register("category", {required: false})}
                                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">
                                                    <option selected="">Select category</option>
                                                    <option value="TV">TV/Monitors</option>
                                                    <option value="PC">PC</option>
                                                    <option value="Food">Food</option>
                                                    <option value="GA">Gaming/Console</option>
                                                    <option value="PH">Phones</option>
                                                </select>
                                            </div>
                                            <div className="sm:col-span-2">
                                                <label htmlFor="description"
                                                       className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Description</label>
                                                <textarea id="description" rows="4"
                                                          className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                                          placeholder="Write product description here" {...register("description")}></textarea>
                                            </div>
                                        </div>
                                        <button type="submit"
                                                className="text-white inline-flex items-center bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
                                            <svg className="mr-1 -ml-1 w-6 h-6" fill="currentColor" viewBox="0 0 20 20"
                                                 xmlns="http://www.w3.org/2000/svg">
                                                <path fill-rule="evenodd"
                                                      d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                                                      clip-rule="evenodd"></path>
                                            </svg>
                                            Add new transaction
                                        </button>
                                    </form>
                                </div>
                            </Dialog>
                            <OfferUserComponent openSider={openSidebar} setWallet={setWallet}/>
                        </>
                    }/>
                    <Route path="/wallet" element={
                        <>
                        <div className={"grid grid-cols-5 grid-rows-auto gap-4 px-32 pt-16 " + (openSidebar ? " ml-36" : " ")}>
                                <div className="col-span-2">
                                    <CreditCard details={wallet != null ? wallet.personal_num : ""} name={wallet != null ? wallet.name : ""} date={"7/24"}/>
                                </div>
                                    { wallet != null && wallet.offers.map(item => { return <OfferComponent category={item.category} num={item.num} partner_name={item.partner_name} price={item.cost} /> })}
                                <div className="col-span-1">
                                    <Card icon={CurrencyEuroIcon} handler={handleOpenBudget} title={"Budget"} value={wallet != null && wallet.expected_budget}/>
                                    <Link to={"/home/offers/user"}><Card icon={BanknotesIcon} title={"Coins"} value={wallet != null && wallet.coins}/></Link>
                                </div>
                        </div>
                        </>
                    }/>

                </Routes>



            </Fragment>
    </>
    )


}