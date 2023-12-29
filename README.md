# Mafia test code
## Assignment
The FBI has captured some Mafia internal records dating from 1985 until the present. They
wish to use these records to map the entire mafia organization so they can put their resources
towards catching the most important members. We need to track closely who reports to who
in the organization cause if a boss has more than 50 people under him he should be put under
special surveillance.

During these years there have been restructurings, murders and imprisonment. Based on
previous investigations, we know how the mafia works when one of these events takes place:
- When an organization member goes to jail, he temporarily disappears from the organization.
All his direct subordinates are immediately relocated and now work for the oldest remaining
boss at the same level as their previous boss. If there is no such possible alternative boss the
oldest direct subordinate of the previous boss is promoted to be the boss of the others.
- When the imprisoned member is released from prison, he immediately recovers his old
position in the organization (meaning that he will have the same boss that he had at the moment
of being imprisoned). All his former direct subordinates are transferred to work for the recently
released member, even if they were previously promoted or have a different boss now.
You are asked to create a computer system for the FBI that allows them to store and manipulate
all the records found. Please make sure to write a method to find out whether a boss has more
than 50 people under him.
Keep in mind good design considerations applicable to the problem such as extensibility,
maintainability, and modularity, among others. Try to develop the most optimal data structure
and algorithms possible to implement the rules described.
Bonus: If you have time, please write a method that given two mafia members identifies which one ranks higher in the organization.

## Design

The first decision that needs to be taken is what structure should be used to store the mafia organization. I have decided to use a Tree since it best represents nodes and its children.

It was needed to find a way to traverse the tree to be able to move children around when a member is imprisioned, killed or released from jail. Breath first search algorithm was used with a slight modification to be able to return one or multiple mafia members.

Each member also maintain its current rank in the organization modifying it when promoted or demoted so we are able to tell which member ranks higher in the organization.

## Install
Run the command below in the same directory where package.json is.
```yarn install```
## Testing
Run the command below in the same directory where package.json is.
```yarn test```

