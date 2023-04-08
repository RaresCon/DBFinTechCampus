use crate::{models::user_model::User, repository::repository::MongoRepo};

use crate::api::user_api::create_hash;
use crate::models::partner_model::Partner;
use rocket::{http::Status, serde::json::Json, State};
use sha2::{digest, Digest, Sha256};

use crate::models::user_model::{BearerToken, UserLogin};

#[post("/register_partner", data = "<new_partner>")]
pub fn create_partner(db: &State<MongoRepo>, new_partner: Json<Partner>) -> Result<Status, Status> {
    let token = create_hash(new_partner.name.clone().as_str(), Sha256::default());
    let partner = Partner {
        id: None,
        name: new_partner.name.to_owned(),
        description: new_partner.description.to_owned(),
        image_link: new_partner.image_link.to_owned(),
        token: token.to_owned(),
    };

    let partner = db.create_partner(partner);

    match partner {
        Ok(_) => Ok(Status::Ok),
        Err(status) => Err(status),
    }
}

#[get("/partners")]
pub fn get_partners(db: &State<MongoRepo>) -> Result<Json<Vec<Partner>>, Status> {
    let partners = db.get_partners();
    match partners {
        Ok(partners) => Ok(Json(partners)),
        Err(status) => Err(status),
    }
}
