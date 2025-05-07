import { hash } from 'bcrypt';
import { DataSource } from 'typeorm';

import { Roles } from '@app/enums';
import { User } from '@app/entities';

export const userSeeds = async (dataSource: DataSource): Promise<void> => {
  const userRepository = dataSource.getRepository(User);

  const users = [
    {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      password: await hash('password123', 10),
      role: Roles.User,
      isVerified: true,
      isBlocked: false,
    },
    {
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@example.com',
      password: await hash('password123', 10),
      role: Roles.User,
      isVerified: true,
      isBlocked: false,
    },
    {
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@example.com',
      password: await hash('admin123', 10),
      role: Roles.Admin,
      isVerified: true,
      isBlocked: false,
    },
  ];

  await userRepository.save(users);
};
