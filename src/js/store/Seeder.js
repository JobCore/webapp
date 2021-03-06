import Faker from 'faker';
import moment from 'moment';

class Seeder {
  make(count, type) {
    if (typeof this.create[type] === 'undefined') throw new Error('You have to specify Seeder what to make');
    const items = [];
    for (let i = 0; i < count; i++) items.push(this.create[type]());
    if (items.length === 1) return items[0];
    return items;
  }

  constructor() {
    this.create = {
      shift() {
        const positionsAvailable = [
          'Baker',
          'Server',
          'Kitchen Asistant',
          'Coordinator',
          'Chef',
          'Bartender',
          'Kitchen Utility',
        ];

        const favoritesOnly = Faker.random.boolean();

        const date = Date.parse(
          `2018-0${Faker.random.number({ min: 1, max: 9 })}-${Faker.random.number({ min: 10, max: 31 })}`
        );

        const maxAllowedEmployees = Faker.random.number({ min: 10, max: 15 });
        const confirmedEmployees = Faker.random.number({ min: 0, max: maxAllowedEmployees });

        const randomStatus = ['Paused', 'Cancelled', 'Draft', 'Receiving candidates'];

        let status;
        if (confirmedEmployees === maxAllowedEmployees) {
          status = 'Filled';
        } else {
          status = randomStatus[Faker.random.number({ min: 0, max: randomStatus.length - 1 })];
        }

        const candidates = [];
        for (let i = 0; i < Faker.random.number({ min: confirmedEmployees, max: maxAllowedEmployees }); i++) {
          candidates.push(this.employee());
        }

        const availableBadges = ['English-Proficient', 'Spanish-Proficient', 'Responsible', 'Respecful', 'Honest'];
        const badgesGained = Faker.random.number({ min: 0, max: availableBadges.length });
        const badges = [];
        for (let i = 0; i < badgesGained; i++) {
          badges.push(availableBadges[i]);
        }

        return {
          id: Faker.random.uuid(),
          location: `${Faker.name.title()} Building`,
          position: positionsAvailable[Faker.random.number({ min: 0, max: positionsAvailable.length - 1 })],
          date,
          start: moment(new Date(date))
            .subtract(Faker.random.number({ min: 1, max: 6 }), 'hours')
            .format('H:mm'),
          end: moment(new Date(date))
            .add(Faker.random.number({ min: 0, max: 3 }), 'hours')
            .format('H:mm'),
          duration: 3,
          status,
          maxAllowedEmployees,
          confirmedEmployees,
          restrictions: {
            favoritesOnly,
            minHourlyRate: Faker.random.number({ min: 10, max: 15 }),
            minAllowedRating: Faker.random.number({ min: 1, max: 5 }),
            badges,
            allowedFromList: ['List #1'],
          },
          candidates,
          acceptedCandidates: [],
        };
      },
      employer() {
        return {
          id: Faker.random.uuid(),
          name: `${Faker.name.firstName()} ${Faker.name.lastName()}`,
          location: Faker.address.streetName,
          favoriteLists: {
            'List #1': [],
            'List #2': [],
            'List #3': [],
          },
          availableBadges: ['English-Proficient', 'Spanish-Proficient', 'Responsible', 'Respecful', 'Honest'],
        };
      },
      employee() {
        const positionsAvailable = ['Baker', 'Sever', 'Kitchen Asistant', 'Coordinator', 'Chef', 'Bartender'];

        const positionsTaken = Faker.random.number({ min: 1, max: positionsAvailable.length });
        const positions = {};
        for (let i = 0; i < positionsTaken; i++) {
          const position = positionsAvailable[i];
          positions[position] = Faker.random.number({ min: 10, max: 20 });
        }

        const availableBadges = ['English-Proficient', 'Spanish-Proficient', 'Responsible', 'Respecful', 'Honest'];
        const badgesGained = Faker.random.number({ min: 0, max: availableBadges.length });
        const badges = [];
        for (let i = 0; i < badgesGained; i++) {
          badges.push(availableBadges[i]);
        }

        const date = `2018-0${Faker.random.number({ min: 1, max: 9 })}-${Faker.random.number({ min: 10, max: 31 })}`;

        const unavailableTimes = [];
        for (let i = 0; i < Faker.random.number({ min: 1, max: 4 }); i++) {
          unavailableTimes.push({
            fromTime: moment(new Date(date))
              .subtract(Faker.random.number({ min: 1, max: 6 }), 'hours')
              .format('H:mm'),
            date: moment(new Date(date))
              .add(Faker.random.number({ min: 1, max: 12 }), 'days')
              .format('YYYY-MM-DD'),
          });
        }

        return {
          id: Faker.random.uuid(),
          name: Faker.name.firstName(),
          lastname: Faker.name.lastName(),
          birthdate: Faker.date.past(),
          responseTime: Faker.random.number({ min: 10, max: 4200 }),
          minHourlyRate: Faker.random.number({ min: 10, max: 15 }),
          positions,
          profilePicUrl: Faker.image.imageUrl(100, 100, 'people'),
          about: Faker.lorem.paragraph(),
          currentJobs: Faker.random.number({ min: 10, max: 35 }),
          rating: Faker.random.number({ min: 1, max: 5, precision: 0.5 }),
          badges,
          unavailableTimes,
          acceptedInShifts: [
            // Array of Ids for each shift where employee was accepted
          ],
        };
      },
      venue() {
        return {
          id: Faker.random.number(),
          name: `${Faker.name.title()} Building`,
          location: { lat: Faker.address.latitude(), long: Faker.address.longitude() },
        };
      },
      menu: () => [
        this.addMenuItem('Dashboard', '/private', 'dashboard'),
        this.addMenuItem('Browse Employee', '/talent/list', 'users'),
        this.addMenuItem('Manage Shifts', '/shift/list', 'calendar'),
        this.addMenuItem('Favorite Employees', '/talent/favorites', 'star'),
        this.addMenuItem('Company Profile', '/profile/', 'user'),
      ],
    };
  }

  addMenuItem(itemName, itemURL, itemIcon = null, itemLinks = null) {
    const icons = ['dashboard', 'area-chart', 'table', 'table', 'wrench'];
    return {
      id: Math.floor(Math.random() * 99999),
      label: itemName,
      url: itemURL,
      links: itemLinks,
      icon: itemIcon || this.icons[Math.floor(Math.random() * icons.length)],
    };
  }

  addMenuItemLink = (linkName, linkURL) => ({
    id: Math.floor(Math.random() * 99999),
    label: linkName,
    url: linkURL,
  });
}

const seederInstance = new Seeder();
export default seederInstance;
