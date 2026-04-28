use near_sdk::borsh::{BorshDeserialize, BorshSerialize};
use near_sdk::{env, near_bindgen};

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize)]
pub struct GalaxyPool {
    pub owner: String,
    pub total_players: u64,
    pub pool_balance: u128,
}

impl Default for GalaxyPool {
    fn default() -> Self {
        Self {
            owner: env::current_account_id().to_string(),
            total_players: 0,
            pool_balance: 0,
        }
    }
}

#[near_bindgen]
impl GalaxyPool {
    #[init]
    pub fn new() -> Self {
        Self::default()
    }

    pub fn get_status(&self) -> (String, u64) {
        (self.pool_balance.to_string(), self.total_players)
    }

    pub fn has_access(&self, account_id: String) -> bool {
        true // for now
    }

    #[payable]
    pub fn join_pool(&mut self) {
        let deposit = env::attached_deposit().as_yoctonear();

        if deposit < 1_000_000_000_000_000_000_000 { // 1 NEAR
            env::panic_str("Minimum deposit is 1 NEAR");
        }

        self.total_players += 1;
        self.pool_balance += deposit;
    }
}
