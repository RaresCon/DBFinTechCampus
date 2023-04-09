mod api;
mod models;
mod repository;

// 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
#[macro_use]
extern crate rocket;
extern crate core;

use crate::repository::repository::MongoRepo;
use api::offer_api::{create_offer, get_offers, get_offers_for_partner};
use api::partner_api::{create_partner, get_partners};
use api::user_api::{login, register};
use api::offer_api::{buy_offer};
use api::wallet_api::{get_wallet};
use api::admin_api::{register_admin, login_as_admin, request_pay};
use rocket::http::Method;
use rocket_cors::{AllowedOrigins, Cors, CorsOptions};

#[launch]
fn rocket() -> _ {
    let db = MongoRepo::init();

    rocket::build()
        .manage(db)
        .attach(create_cors())
        .mount("/", routes![register])
        .mount("/", routes![login])
        .mount("/", routes![create_partner])
        .mount("/", routes![get_partners])
        .mount("/", routes![create_offer])
        .mount("/", routes![get_offers])
        .mount("/", routes![get_offers_for_partner])
        .mount("/", routes![buy_offer])
        .mount("/", routes![get_wallet])
        .mount("/", routes![register_admin])
        .mount("/", routes![login_as_admin])
        .mount("/", routes![request_pay])
}

fn create_cors() -> Cors {
    let cors = CorsOptions::default()
        .allowed_origins(AllowedOrigins::all())
        .allowed_methods(
            vec![Method::Get, Method::Post, Method::Patch, Method::Delete]
                .into_iter()
                .map(From::from)
                .collect(),
        );
    cors.to_cors().expect("Error creating CORS\n")
}
