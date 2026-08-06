const { faker } = require('@faker-js/faker');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

const DEMO_USERNAME = 'demo';
const DEMO_PASSWORD = 'demo1234';

const avatarFor = (seed) => `https://api.dicebear.com/9.x/notionists/svg?seed=${seed}`;

async function main() {
  await prisma.like.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.post.deleteMany();
  await prisma.user.deleteMany();

  const demo = await prisma.user.create({
    data: {
      username: DEMO_USERNAME,
      password: await bcrypt.hash(DEMO_PASSWORD, 10),
      bio: 'Just a noodle, cooking up thoughts.',
      avatarUrl: avatarFor('noodle'),
    },
  });

  const users = [demo];
  for (let i = 0; i < 9; i++) {
    const username = faker.internet.username().toLowerCase();
    users.push(
      await prisma.user.create({
        data: {
          username,
          password: await bcrypt.hash(faker.internet.password(), 10),
          bio: faker.person.bio(),
          avatarUrl: avatarFor(username),
        },
      })
    );
  }

  for (const user of users.slice(1)) {
    await prisma.user.update({
      where: { id: demo.id },
      data: { follows: { connect: { id: user.id } } },
    });
    if (faker.datatype.boolean()) {
      await prisma.user.update({
        where: { id: user.id },
        data: { follows: { connect: { id: demo.id } } },
      });
    }
  }

  const posts = [];
  for (const user of users) {
    for (let j = 0; j < 3; j++) {
      const post = await prisma.post.create({
        data: {
          title: faker.lorem.sentence({ min: 3, max: 6 }).replace(/\.$/, ''),
          content: faker.lorem.paragraph({ min: 2, max: 4 }),
          postImageUrl: `https://picsum.photos/seed/${faker.string.alphanumeric(8)}/800/560`,
          authorId: user.id,
          createdAt: faker.date.recent({ days: 21 }),
        },
      });
      posts.push(post);
    }
  }

  for (const post of posts) {
    const likers = faker.helpers.arrayElements(users, faker.number.int({ min: 1, max: 6 }));
    for (const liker of likers) {
      await prisma.like.create({
        data: { userId: liker.id, postId: post.id },
      });
    }

    const commenters = faker.helpers.arrayElements(users, faker.number.int({ min: 0, max: 3 }));
    for (const commenter of commenters) {
      await prisma.comment.create({
        data: {
          content: faker.lorem.sentence({ min: 4, max: 10 }),
          userId: commenter.id,
          postId: post.id,
          createdAt: faker.date.recent({ days: 14 }),
        },
      });
    }
  }

  console.log(
    `Seeded noodle: 10 users, ${posts.length} posts with likes & comments. ` +
      `Demo login: ${DEMO_USERNAME} / ${DEMO_PASSWORD}`
  );
}

main()
  .catch((error) => {
    console.error('Error seeding database:', error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
