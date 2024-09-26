# Library Management Erpnext Development
## Description

A comprehensive Library Management System built using **ERPNext/Frappe**. This application allows librarians to efficiently manage books, track member activities, handle transactions, and monitor outstanding debts. The system is designed to streamline library operations, making it easier to maintain records and ensure smooth functioning.


## Features

* **Book Management**
  - Add, update, delete, and view books.
  - Track the quantity of each book available in the library.
  - Search for books by name and author.

* **Member Management**
  - Register new members using the `Member` and automatically created the customer module.
  - Track members' outstanding debts.

* **Transaction Management**
  - Issue books to members.
  - Handle book returns.
  - Calculate and apply rent fees upon return.
  - Manage book stock automatically based on transactions.
  - cannot select a member with a debt more than 500
  - Thows an error if the book doesnt exist or is zero in the library

* **Payment Handling**
  - Utilize `Payment Entry` for managing fees and dues.

## Installation

### Prerequisites

* **ERPNext/Frappe Framework** installed.
* Access to the Frappe bench environment.

### Steps

1. **Clone the Repository**
   ```bash
   bench get-app https://github.com/yourusername/library_management.git
   bench --site name_site install-app library_management
   bench --site name_site migrate

2.**work flow**
* create an item which is a book, and also add its item_price
* create a library select a book and will show the total available books
* go to books and add the publisher and on the child table add a book description which has a link to the library add the number of books you are adding and upon saving will update the total books to the library
* go to membership add a member fill up the field when saving will create a customer automatically,the member can make a payment from there which will reflect in the outstanding Amount/Debt each time a member adds an amount will add upto the outstanding amount/debt
* go to transaction issue a book to the member and a rent shall be chanrged on the member and the rent charged shall deduct the outstanding amount /debt
* once the amout is deducted and reaches less than -500 the member link shall filter and th member shall not be able to get any book until payment is done
* lastly the  rent fee is the item price , and the field is not readonly so one can update the charges for example upon return the book was damaged something like that
* Also in membership there is usage of indicators things like those
* Any payment sends email to the member

  
