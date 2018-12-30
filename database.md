### Database name : node_sequelize

```
CREATE DATABASE node_sequelize;
```

### Don't need to create the tables tables will be created by sequelize

### tables:

        1: users



        2: movies

### Run the App so sequelize create the table for us.

## Now Add foreign key on to movies

### Add foreign column u_id

```
ALTER TABLE movies ADD u_id INT NOT NULL ;

```

### Now Add foreign relation between tables

```
ALTER TABLE movies ADD FOREIGN KEY (u_id) REFERENCES users(id);
```
