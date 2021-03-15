import json
from casq import casq

# Parse Data
def parse_data():

    items = casq()
    params = json.load(open("filter.json", "r"))

    def create_row(G, side, tp):
        rows = []
        infos = ["fm","rb"]
        sides = dict(right=[0,1,2], left=[3,4,5])
        for info in infos:
            for a in range(len(items[info])):
                rows.append([items[info][a][0], 
                    items[info][a][1][G][sides[side][tp]]
                ])
        return rows

    def create_cluster(G):
        sides = ["right","left"]
        lett = ["a","b","c"]
        cluster = dict()
        for side in sides:
            for let in lett:
                key = ("temp_casq_g" + str(G) + "_" + side + "_" + let)
                cluster[key] = dict(
                    name = side + "_" + let,
                    type = "linechart", um = "C",
                    data = create_row(G-19, side, lett.index(let))
                )
        # Return Dataset Cluster
        return cluster

    # Create Datasets
    data = dict()
    data.update(create_cluster(19))
    data.update(create_cluster(20))
    data.update(create_cluster(21))
    data.update(create_cluster(22))
    data.update(create_cluster(23))
    data.update(create_cluster(24))
    data.update(create_cluster(25))
    data.update(create_cluster(26))
    data.update(create_cluster(27))
    data.update(create_cluster(28))

    return data

data = parse_data()
json.dump(data, open("data.json","w"))