# solana-blog
An example of creating a Solana program to build a blog and create posts using Anchor. It demonstrates how PDAs are generated and how they work.

### Version
- [Solana Tool Suite](https://solana.com/): 1.8.12
- [Rust](https://www.rust-lang.org/): 1.58.0
- [Anchor CLI](https://project-serum.github.io/anchor/): 0.20.1
- [TypeScript](https://www.typescriptlang.org/): 4.3.5

### Installation
Install Solana Tool Suite.
```
sh -c "$(curl -sSfL https://release.solana.com/v1.8.12/install)"
```

Update the `PATH` environment variable to include Solana programs by adding the following command to `.profile` and `.zshrc` in your home directory.
```
export PATH="/Users/celiakwan/.local/share/solana/install/active_release/bin:$PATH"
```
Then run this to make the changes applicable in the shell.
```
source ~/.zshrc
```

Install Rust.
```
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

Install Anchor CLI.
```
cargo install --git https://github.com/project-serum/anchor --tag v0.20.1 anchor-cli --locked
```

### Configuration
Generate a key pair.
```
solana-keygen new
```

Set the network to localhost.
```
solana config set --url localhost
```

Each key pair will automatically start with 500,000,000 SOL.

### Build
```
anchor build
```

### Deployment
1. Get the program ID.
```
solana address -k target/deploy/solana_blog-keypair.json
```

2. Update `programs/solana-blog/src/lib.rs` with the program ID generated above.
```
declare_id!("9muDycj4AvNNTKpMVdZJZfhS72YLRFAt2ZwEQDWKoDom");
```

3. Update `Anchor.toml` with the program ID generated above.
```
[programs.localnet]
solana_blog = "9muDycj4AvNNTKpMVdZJZfhS72YLRFAt2ZwEQDWKoDom"
```

4. Run a local validator.
```
solana-test-validator
```

5. Deploy the program.
```
anchor deploy
```

### Testing
```
anchor test
```

### Reference
- https://dev.to/findiglay/building-a-blog-on-solana-2pg8