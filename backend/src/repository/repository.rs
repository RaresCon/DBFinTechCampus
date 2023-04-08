use std::env;
use std::fs::create_dir;

extern crate dotenv;
use dotenv::dotenv;

use mongodb::{
    bson::{extjson::de::Error},
    results::{ InsertOneResult},
    sync::{Client, Collection},
};
use mongodb::bson::doc;
use mongodb::bson::oid::ObjectId;
use mongodb::options::ClientOptions;
use rocket::http::Status;
use serde::__private::de::InternallyTaggedUnitVisitor;
use sha2::Sha256;
use crate::api::user_api::create_hash;
use crate::models::user_model::User;
use crate::models::wallet_model::Wallet;

pub struct MongoRepo {
    col_users: Collection<User>,
    col_wallets: Collection<Wallet>,
}

impl MongoRepo {
    pub fn init() -> Self {
        dotenv().ok();
        let uri = "mongodb+srv://RaresCon:LpXTTDBGwyZC3RS2@db.wrcp80s.mongodb.net/?retryWrites=true&w=majority";
        let mut client_options = ClientOptions::parse(uri);
        let client = Client::with_options(client_options.unwrap());

        let db = client.expect("No database found\n").database("DB");
        let col_users: Collection<User> = db.collection("User");
        let col_wallets: Collection<Wallet> = db.collection("Wallet");
        MongoRepo { col_users, col_wallets }
    }

    pub fn create_user(&self, new_user: User) -> Result<InsertOneResult, Error> {
        let user_email_clone = new_user.e_mail.clone();
        let new_user_doc = User {
            id: None,
            name: new_user.name,
            e_mail: new_user.e_mail,
            password: new_user.password,
        };

        let user = self.col_users
                       .insert_one(new_user_doc, None)
                       .ok()
                       .expect("Error creating user\n");

        let filter = doc! {"e_mail": user_email_clone.clone()};
        let current_user = self.col_users
                               .find_one(filter, None)
                               .ok()
                               .expect("Error getting current user\n")
                               .unwrap();
        let new_wallet_doc = Wallet {
            id: None,
            user_id: current_user.id.unwrap(),
            e_mail: user_email_clone,
            personal_num: String::from("1111 1111 1111 1111"),
            coins: 0,
            currency: 0.0,
        };
        let wallet = self.col_wallets
            .insert_one(new_wallet_doc, None)
            .ok()
            .expect("Error creating wallet\n");
        Ok(user)
    }

    pub fn login_user(&self, e_mail: String, pass: String) -> Result<User, Status> {
        let filter = doc! {"e_mail": e_mail};

        let user_detail = self
            .col_users
            .find_one(filter, None)
            .ok()
            .expect("Error getting user's detail");

        return match user_detail {
            None => {
                Err(Status::InternalServerError)
            }
            Some(details) => {
                if details.password != create_hash(pass.as_str(), Sha256::default()) {
                    return Err(Status::BadRequest);
                }
                Ok(details)
            }
        };
    }
}
