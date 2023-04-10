import {useEffect, useState} from "react";
import axios from "axios";
import {useCookies} from "react-cookie";
import {Button} from "@material-tailwind/react";

function UserOffer(props) {
    const [cookies, setCookie, removeCookie] = useCookies(['token']);


    const getOffer = () => {
        const send = {
            user_id: cookies.token.token,
            offer_id: props._id.$oid
        }

        axios.post("http://localhost:8000/user_offers", send)
            .then(res => {
                console.log(res);
                props.setWallet(null);
            })
            .catch(err => {
                console.log(err);
            })
    }

    return (
        <section className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out dark:bg-gray-700 rounded-2xl text-left flex px-auto items-center justify-center">
            <div className="py-8 px-8 mx-auto max-w-2xl">
                <h2 className="mb-2 text-xl font-semibold leading-none text-gray-900 md:text-2xl dark:text-white">{props.partner_name}</h2>
                <p className="mb-4 text-xl font-extrabold leading-none text-gray-900 md:text-2xl dark:text-white">{props.price} tokens</p>
                <dl>
                    <dt className="mb-2 font-semibold leading-none text-gray-900 dark:text-white">Details</dt>
                    <dd className="mb-4 font-light text-gray-500 sm:mb-5 dark:text-gray-400">{props.description}
                    </dd>
                </dl>
                <dl className="flex items-center space-x-6">
                    <div>
                        <dt className="mb-2 text-lg font-semibold leading-none text-gray-900 dark:text-white">Category</dt>
                        <dd className="mb-4 text-lg font-light text-gray-500 sm:mb-5 dark:text-gray-400">{props.category}</dd>
                    </div>
                    {/*<div>*/}
                    {/*    <dt className="mb-2 text-lg font-semibold leading-none text-gray-900 dark:text-white">Item count</dt>*/}
                    {/*    <dd className="mb-4 text-lg  font-light text-gray-500 sm:mb-5 dark:text-gray-400">{props.num}</dd>*/}
                    {/*</div>*/}
                </dl>
                <div className="flex items-center space-x-4">
                    <button type="button" onClick={getOffer}
                            className="text-white inline-flex items-center bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
                        <svg aria-hidden="true" className="mr-1 -ml-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20"
                             xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z"></path>
                            <path fill-rule="evenodd"
                                  d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"
                                  clip-rule="evenodd"></path>
                        </svg>
                        Get offer
                    </button>
                    <button type="button"
                            className="inline-flex items-center text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-red-500 dark:hover:bg-red-600 dark:focus:ring-red-900">
                        <svg aria-hidden="true" className="w-5 h-5 mr-1.5 -ml-1" fill="currentColor" viewBox="0 0 20 20"
                             xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd"
                                  d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                  clip-rule="evenodd"></path>
                        </svg>
                        Ignore offer
                    </button>
                </div>
            </div>
        </section>
    )
}

export default function OfferUserComponent(props) {
    const [offers, setOffer] = useState([]);

    useEffect(() => {
        if (offers.length !== 0) {
            return;
        }

        axios.get("http://localhost:8000/user_offers")
            .then(res => {
                console.log(res.data);
                setOffer(res.data);
            })
            .catch(err => {
                console.log(err)
            });
    })

    return (
        <div className="w-full">
            <div className={"p-16 px-32 flex-row" + (" ml-36")}>
                {/*<Button size={"lg"} className="justify-start items-start left-auto object-left">Add offer</Button>*/}
                <div className="grid grid-cols-3 grid-rows-auto gap-4 mt-4">

                    {offers.length === 0 && <div className="w-full flex items-center text-4xl justify-center text-center dark:text-white">Oops, no offers available right now</div>}
                    {offers.map(item => <UserOffer partner_name={item.partner_name} price={item.cost} num={item.num} category={item.category} description={item.description} _id={item._id}/>)}
                    {/*<UserOffer partner_name={"Google"} price={10} num={4} category={"Food"} description={"Standard glass ,3.8GHz 8-core 10th-generation Intel Core i7 processor, Turbo Boost up to 5.0GHz, 16GB 2666MHz DDR4 memory, Radeon Pro 5500 XT with 8GB of GDDR6 memory, 256GB SSD storage, Gigabit Ethernet, Magic Mouse 2, Magic Keyboard - US."} />*/}
                    {/*<PartnerOffer partner_name={"Google"} price={10} num={4} category={"Food"} description={"Standard glass ,3.8GHz 8-core 10th-generation Intel Core i7 processor, Turbo Boost up to 5.0GHz, 16GB 2666MHz DDR4 memory, Radeon Pro 5500 XT with 8GB of GDDR6 memory, 256GB SSD storage, Gigabit Ethernet, Magic Mouse 2, Magic Keyboard - US."} />*/}
                    {/*<PartnerOffer partner_name={"Google"} price={10} num={4} category={"Food"} description={"Standard glass ,3.8GHz 8-core 10th-generation Intel Core i7 processor, Turbo Boost up to 5.0GHz, 16GB 2666MHz DDR4 memory, Radeon Pro 5500 XT with 8GB of GDDR6 memory, 256GB SSD storage, Gigabit Ethernet, Magic Mouse 2, Magic Keyboard - US."} />*/}
                    {/*<PartnerOffer partner_name={"Google"} price={10} num={4} category={"Food"} description={"Standard glass ,3.8GHz 8-core 10th-generation Intel Core i7 processor, Turbo Boost up to 5.0GHz, 16GB 2666MHz DDR4 memory, Radeon Pro 5500 XT with 8GB of GDDR6 memory, 256GB SSD storage, Gigabit Ethernet, Magic Mouse 2, Magic Keyboard - US."} />*/}
                    {/*<PartnerOffer partner_name={"Google"} price={10} num={4} category={"Food"} description={"Standard glass ,3.8GHz 8-core 10th-generation Intel Core i7 processor, Turbo Boost up to 5.0GHz, 16GB 2666MHz DDR4 memory, Radeon Pro 5500 XT with 8GB of GDDR6 memory, 256GB SSD storage, Gigabit Ethernet, Magic Mouse 2, Magic Keyboard - US."} />*/}
                </div>
            </div>

        </div>

    )
}