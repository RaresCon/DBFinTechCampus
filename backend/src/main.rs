mod api;
mod models;
mod repository;

// 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
#[macro_use] extern crate rocket;
extern crate core;


use rocket::http::{Method};
use rocket_cors::{AllowedOrigins, Cors, CorsOptions};
use crate::repository::repository::MongoRepo;
use api::user_api::{register, login};
use api::partner_api::{create_partner, get_partners};

#[launch]
fn rocket() -> _ {
    let db = MongoRepo::init();

    rocket::build().manage(db)
                   .attach(create_cors())
                   .mount("/", routes![register])
                   .mount("/", routes![login])
                   .mount("/", routes![create_partner])
                   .mount("/", routes![get_partners])

}

fn create_cors() -> Cors {
    let cors = CorsOptions::default().allowed_origins(AllowedOrigins::all())
                                     .allowed_methods(
                                        vec![Method::Get,
                                             Method::Post,
                                             Method::Patch,
                                             Method::Delete].into_iter()
                                                            .map(From::from)
                                                            .collect(),
                                     );
    cors.to_cors().expect("Error creating CORS\n")
}