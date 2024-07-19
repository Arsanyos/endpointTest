<!-- Business form -->
orgId
---
name 
description
image

<!-- Customer contact form IN Create Customer -->
title
first_name
last_name
email
contact_phone
description (NEW)


<!-- Payment Method Form -->
busId
---
account_name
account_number
method
account_type (individual,company)

<!-- Product form -->
<!-- busId
-----
name
description -->

<!-- Customer Invoice Form -->
cusId , prodId
-----
product (string)
customer (string)

amount (number)
paid_amount (number)
status (fully_paid, partially_paid, pending, cancelled) (string)
currency (string)
due_date (date)
note (string) --- optional