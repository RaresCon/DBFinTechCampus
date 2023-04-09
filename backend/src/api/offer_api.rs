use crate::{models::offer_model, repository::repository::MongoRepo};

use crate::api::user_api::create_hash;
use crate::models::offer_model::{Offer, OfferPayment, UserOffer};
use rocket::{http::Status, serde::json::Json, State};
use serde::Serialize;
use sha2::{digest, Digest, Sha256};

use crate::models::user_model::{BearerToken, UserLogin};

#[post("/register_offer", data = "<new_offer>")]
pub fn create_offer(db: &State<MongoRepo>, new_offer: Json<Offer>) -> Result<Status, Status> {
    let offer = Offer {
        id: None,
        partner_name: new_offer.partner_name.to_owned(),
        name: new_offer.name.to_owned(),
        description: new_offer.description.to_owned(),
        num: new_offer.num.to_owned(),
        cost: new_offer.cost.to_owned(),
        category: new_offer.category.to_owned(),
        token: new_offer.token.to_owned(),
    };

    let offer = db.create_offer(offer);

    match offer {
        Ok(_) => Ok(Status::Ok),
        Err(status) => Err(status),
    }
}

#[post("/register_user_offer", data = "<new_offer>")]
pub fn create_user_offer(db: &State<MongoRepo>, new_offer: Json<UserOffer>) -> Result<Status, Status> {
    let user_offer = UserOffer {
        id: None,
        name: new_offer.name.to_owned(),
        description: new_offer.description.to_owned(),
        cost: new_offer.cost.to_owned(),
        category: new_offer.category.to_owned(),
    };

    let offer = db.create_user_offer(user_offer);

    match offer {
        Ok(_) => Ok(Status::Ok),
        Err(status) => Err(status),
    }
}

#[get("/user_offers")]
pub fn get_user_offers(db: &State<MongoRepo>) -> Result<Json<Vec<UserOffer>>, Status> {
    let offers = db.get_user_offers();
    match offers {
        Ok(user_offers) => Ok(Json(user_offers)),
        Err(status) => Err(status),
    }
}

#[get("/offers")]
pub fn get_offers(db: &State<MongoRepo>) -> Result<Json<Vec<Offer>>, Status> {
    let offers = db.get_offers();
    match offers {
        Ok(offers) => Ok(Json(offers)),
        Err(status) => Err(status),
    }
}

#[get("/offers/<partner_name>")]
pub fn get_offers_for_partner(
    db: &State<MongoRepo>,
    partner_name: String,
) -> Result<Json<Vec<Offer>>, Status> {
    let offers = db.get_offers_for_partner(partner_name);
    match offers {
        Ok(offers) => Ok(Json(offers)),
        Err(status) => Err(status),
    }
}

#[post("/offers", data = "<offer_payment_info>")]
pub fn buy_offer(
    db: &State<MongoRepo>,
    offer_payment_info: Json<OfferPayment>,
) -> Result<Status, Status> {
    db.buy_offer(offer_payment_info.user_id.to_owned(), offer_payment_info.offer_id.to_owned())
}

#[post("/user_offers", data = "<offer_payment_info>")]
pub fn buy_user_offer(db: &State<MongoRepo>,
                      offer_payment_info: Json<OfferPayment>) -> Result<Status, Status> {
    db.buy_user_offer(offer_payment_info.user_id.to_owned(), offer_payment_info.offer_id.to_owned())
}
