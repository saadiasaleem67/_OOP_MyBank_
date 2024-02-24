import { faker } from "@faker-js/faker";
import chalk from "chalk";
import inquirer from "inquirer";
class Customer {
    constructor(fName, lName, age, gender, mob, acc) {
        this.firstName = fName;
        this.lastName = lName;
        this.age = age;
        this.gender = gender;
        this.mobNumber = mob;
        this.accNumber = acc;
    }
}
class Bank {
    constructor() {
        this.customer = [];
        this.account = [];
    }
    addCustomer(obj) {
        this.customer.push(obj);
    }
    addaccountNumber(obj) {
        this.account.push(obj);
    }
    transation(accObj) {
        let newAccount = this.account.filter((acc) => acc.accnumber !== accObj.accnumber);
        this.account = [...newAccount, accObj];
    }
}
let myBank = new Bank();
for (let i = 1; i <= 3; i++) {
    let fName = faker.person.firstName("male");
    let lName = faker.person.lastName();
    let num = parseInt(faker.phone.number("3#######"));
    let cus = new Customer(fName, lName, 25 * i, "male", num, 100 + i);
    myBank.addCustomer(cus);
    myBank.addaccountNumber({ accnumber: cus.accNumber, balance: 1000 * i });
}
async function bankServise(myBank) {
    do {
        let service = await inquirer.prompt({
            type: "list",
            name: "select",
            message: "Select any one Service",
            choices: ["Veiw Balance", "Cash Withdraw", "Cash Deposit", "Exit"]
        });
        if (service.select === "Veiw Balance") {
            let res = await inquirer.prompt({
                type: "input",
                name: "number",
                message: "Pleace enter your Account Number"
            });
            let account = myBank.account.find((acc) => acc.accnumber == res.number);
            if (!account) {
                console.log(chalk.red.bold.italic("Invaild account number"));
            }
            if (account) {
                let name = myBank.customer.find((item) => item.accNumber == account?.accnumber);
                console.log(`Dear ${chalk.green.italic(name?.firstName)} ${chalk.green.italic(name?.lastName)} Your account balance is $${chalk.gray(account.balance)}`);
            }
        }
        if (service.select === "Cash Withdraw") {
            let res = await inquirer.prompt({
                type: "input",
                name: "number",
                message: "Pleace enter your Account Number"
            });
            let account = myBank.account.find((acc) => acc.accnumber == res.number);
            if (!account) {
                console.log(chalk.red.bold.italic("Invaild account number"));
            }
            if (account) {
                let ans = await inquirer.prompt({
                    type: "number",
                    name: "rupee",
                    message: "Pleace enter your Amount"
                });
                if (ans.rupee > account.balance) {
                    console.log(chalk.red.bold("Balance is not available"));
                }
                let newBalnce = account.balance - ans.rupee;
                myBank.transation({ accnumber: account.accnumber, balance: newBalnce });
                console.log("Your remaning Balance is", newBalnce);
            }
        }
        if (service.select === "Cash Deposit") {
            let res = await inquirer.prompt({
                type: "input",
                name: "number",
                message: "Pleace enter your Account Number"
            });
            let account = myBank.account.find((acc) => acc.accnumber == res.number);
            if (!account) {
                console.log(chalk.red.bold.italic("Invaild account number"));
            }
            if (account) {
                let ans = await inquirer.prompt({
                    type: "number",
                    name: "rupee",
                    message: "Pleace enter your Amount"
                });
                let newBalnce = account.balance + ans.rupee;
                myBank.transation({ accnumber: account.accnumber, balance: newBalnce });
                console.log("Your Balance is", newBalnce);
            }
        }
        if (service.select === "Exit") {
            process.exit();
        }
    } while (true);
}
bankServise(myBank);
