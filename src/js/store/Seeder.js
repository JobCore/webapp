import Faker from "faker";

class Seeder {

  make(count, type) {

    if (typeof this.create[type] == "undefined") throw "You have to specify Seeder what to make";
    var items = [];
    for (var i = 0; i < count; i++) items.push(this.create[type]());
    if (items.length == 1) return items[0];
    return items;
  }

  constructor() {
    this.create = {
      shift: function () {
        return {
          id: Faker.random.number(),
          location: Faker.name.title() + "Building ",
          position: Faker.name.jobTitle(),
          date: Faker.date.future(),
          start: "6:00pm",
          end: "6:00pm",
        };
      },
      employee: function () {
        return {
          id: Faker.random.number(),
          name: Faker.name.firstName() + "Building ",
          lastname: Faker.name.lastName(),
          birthdate: Faker.date.past(),
          favorite: true,
          responseTime: "30 minutes",
        };
      },
      venue: function () {
        return {
          id: Faker.random.number(),
          name: Faker.name.title() + "Building ",
          location: { lat: Faker.address.latitude(), long: Faker.address.longitude(), },
        };
      },
      menu: () => {
        return [
          this.addMenuItem("Dashboard", "/private", "dashboard"),
          this.addMenuItem("My Shifts", "/shift", "calendar", [
            this.addMenuItemLink("All Shifts", "/shift/list"),
          ]),
          this.addMenuItem("Talent Pool", "/talent", "users", [
            this.addMenuItemLink("All Employees", "/talent/list"),
          ]),
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
