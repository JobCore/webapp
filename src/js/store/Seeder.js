import Faker from "faker";

class Seeder {
  make(count, type) {

    if (typeof this.create[type] === "undefined") throw new Error("You have to specify Seeder what to make");
    var items = [];
    for (var i = 0; i < count; i++) items.push(this.create[type]());
    if (items.length === 1) return items[0];
    return items;
  }

  constructor() {
    this.create = {
      shift: function () {
        let favoritesOnly = Faker.random.boolean();
        let allowAnyone = favoritesOnly ? false : true;

        return {
          id: Faker.random.uuid(),
          location: Faker.name.title() + " Building",
          position: Faker.name.jobTitle(),
          date: Faker.date.future(),
          start: "6:00pm",
          end: "9:00pm",
          favoritesOnly: favoritesOnly,
          allowAnyone: allowAnyone,
        };
      },
      employer: function () {
        return {
          id: Faker.random.uuid(),
          name: Faker.name.firstName() + " " + Faker.name.lastName(),
          favoriteLists: [
            "List #1", "List #2", "List #3",
          ],
        };
      },
      employee: function () {
        const rolesAvailable = [
          "Bartender", "Server", "Kitchen Assistant",
        ];
        const rolesTaken = Faker.random.number({ min: 1, max: rolesAvailable.length, });
        let roles = {};
        for (let i = 0; i < rolesTaken; i++) {
          let role = rolesAvailable[i];
          roles[role] = Faker.random.number({ min: 10, max: 50, });
        }

        const favoritedLists = [];
        for (let i = 1; i <= Faker.random.number({ min: 0, max: 3, }); i++) {
          favoritedLists.push(`List #${i}`);
        }

        return {
          id: Faker.random.uuid(),
          name: Faker.name.firstName(),
          lastname: Faker.name.lastName(),
          birthdate: Faker.date.past(),
          favorite: favoritedLists.length > 0,
          responseTime: "30 minutes",
          minHourlyRate: "$ " + Faker.random.number({ min: 10, max: 15, }) + "/hr",
          roles: roles,
          profilePicUrl: Faker.image.imageUrl(300, 300, "people"),
          about: Faker.lorem.paragraph(),
          currentJobs: Faker.random.number({ min: 10, max: 35, }),
          rating: Faker.random.number({ min: 1, max: 5, precision: 0.5, }),
          favoritedLists: favoritedLists,
        };
      },
      venue: function () {
        return {
          id: Faker.random.number(),
          name: Faker.name.title() + " Building",
          location: { lat: Faker.address.latitude(), long: Faker.address.longitude(), },
        };
      },
      menu: () => {
        return [
          this.addMenuItem("Dashboard", "/private", "dashboard"),
          this.addMenuItem("Browse Employee", "/talent/list", "users", ),
          this.addMenuItem("Manage Shifts", "/shift/list", "calendar"),
          this.addMenuItem("Favorite Employees", "/talent/favorites", "star"),
          this.addMenuItem("Company Profile", "/profile/", "user"),
        ];
      },
    };
  }

  addMenuItem(itemName, itemURL, itemIcon = null, itemLinks = null) {

    let icons = ["dashboard", "area-chart", "table", "table", "wrench",];
    return {
      id: Math.floor(Math.random() * 99999),
      label: itemName,
      url: itemURL,
      links: itemLinks,
      icon: itemIcon || icons[Math.floor(Math.random() * icons.length)],
    };
  }
  addMenuItemLink(linkName, linkURL) {
    return {
      id: Math.floor(Math.random() * 99999),
      label: linkName,
      url: linkURL,
    };
  }
}

var seederInstance = new Seeder();
export default seederInstance;
