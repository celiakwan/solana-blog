import assert from 'assert';
import * as anchor from '@project-serum/anchor';
import { SolanaBlog } from '../target/types/solana_blog';
import type { PublicKey } from '@solana/web3.js';

describe('solana-blog', () => {
  const program = anchor.workspace.SolanaBlog as anchor.Program<SolanaBlog>;
  const provider = anchor.Provider.env();
  anchor.setProvider(provider);
  let blogAccount: PublicKey;
  let blogAccountBump: number;
  let postAccount: PublicKey;
  let postAccountBump: number;

  before(async () => {
    [blogAccount, blogAccountBump] = await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from('blog'), provider.wallet.publicKey.toBuffer()],
      program.programId
    );
    [postAccount, postAccountBump] = await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from('post'), blogAccount.toBuffer(), new anchor.BN(0).toArrayLike(Buffer)],
      program.programId
    );
  });

  it('Initialize blog account', async () => {
    await program.rpc.initialize(blogAccountBump, {
      accounts: {
        blogAccount,
        user: provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId
      }
    });

    const blogData = await program.account.blog.fetch(blogAccount);
    assert.equal(blogData.user, provider.wallet.publicKey.toString(), 'Incorrect user');
    assert.equal(blogData.postCount, 0, 'Incorrect post count');
  });

  it('Create a post', async () => {
    const title = 'New Post';
    const body = 'This is a new post.';
    
    await program.rpc.createPost(postAccountBump, title, body, {
      accounts: {
        blogAccount,
        postAccount,
        user: provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId
      }
    });

    const blogData = await program.account.blog.fetch(blogAccount);
    assert.equal(blogData.user, provider.wallet.publicKey.toString(), 'Incorrect user');
    assert.equal(blogData.postCount, 1, 'Incorrect post count');

    const postData = await program.account.post.fetch(postAccount);
    assert.equal(blogData.user, provider.wallet.publicKey.toString(), 'Incorrect user');
    assert.equal(postData.title, title, 'Incorrect title');
    assert.equal(postData.body, body, 'Incorrect body');
  });

  it('Update the post', async () => {
    const title = 'Updated Post';
    const body = 'This post has been updated.';

    await program.rpc.updatePost(title, body, {
      accounts: {
        blogAccount,
        postAccount,
        user: provider.wallet.publicKey
      }
    });

    const blogData = await program.account.blog.fetch(blogAccount);
    assert.equal(blogData.user, provider.wallet.publicKey.toString(), 'Incorrect user');
    assert.equal(blogData.postCount, 1, 'Incorrect post count');

    const postData = await program.account.post.fetch(postAccount);
    assert.equal(blogData.user, provider.wallet.publicKey.toString(), 'Incorrect user');
    assert.equal(postData.title, title, 'Incorrect title');
    assert.equal(postData.body, body, 'Incorrect body');
  });
});
