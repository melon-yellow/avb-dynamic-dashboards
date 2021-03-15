import json

# Parse Layout
def parse_layout():

    # Create content
    content = list()
    # Iterate through Stands
    for i in range(19, 29):
        # Append Row
        content.append({
                "type": "row",
                "content": [
                    {
                    "type": "col",
                    "grid": 6,
                    "content": [
                        {
                        "type": "card",
                        "name": "GAIOLA {} CASQ. ESQUERDO".format(i),
                        "header": {
                            "color": "#f8f9fa",
                            "font": {
                            "color": "#343a40",
                            "size": 1.2
                            }
                        },
                        "body": {
                            "height": 40,
                            "color": "#f8f9fa",
                            "background":"#fff"
                        },
                        "elements": [
                            {
                                "type": "linebarchart",
                                "addons": {
                                    "ticks": {
                                    "x": {
                                        "display": True,
                                        "fontStyle": "",
                                        "fontSize": 10
                                    },
                                    "y": {
                                        "display": True,
                                        "fontStyle": "",
                                        "fontSize": 10
                                    }
                                    },
                                    "grid": {
                                    "x": False,
                                    "y": True
                                    },
                                    "legend": {
                                    "display": False,
                                    "position": "right"
                                    },
                                    "type": "time"
                                },
                                "update": {
                                    "type": "default",
                                    "duration": 1000
                                },
                                "data": [
                                    {
                                    "dataset": "temp_casq_g{}_left_a".format(i),
                                    "type": "line", "display": True,
                                    "color": "rgb(255,215,0)",
                                    "datalabels": { "display": False }
                                    },{
                                    "dataset": "temp_casq_g{}_left_b".format(i),
                                    "type": "line", "display": True,
                                    "color": "rgb(255,48,48)",
                                    "datalabels": { "display": False }                              
                                    },{
                                    "dataset": "temp_casq_g{}_left_c".format(i),
                                    "type": "line", "display": True,
                                    "color": "rgb(64,64,255)",
                                    "datalabels": { "display": False }                                   
                                    }
                                ]
                                }
                            ]
                            }
                        ]
                    },{
                        "type": "col",
                        "grid": 6,
                        "content": [
                            {
                            "type": "card",
                            "name": "GAIOLA {} CASQ. DIREITO".format(i),
                            "header": {
                                "color": "#f8f9fa",
                                "font": {
                                "color": "#343a40",
                                "size": 1.2
                                }
                            },
                            "body": {
                                "height": 40,
                                "color": "#f8f9fa"
                            },
                            "elements": [
                                {
                                "type": "linebarchart",
                                "addons": {
                                    "ticks": {
                                    "x": {
                                        "display": True,
                                        "fontStyle": "",
                                        "fontSize": 10
                                    },
                                    "y": {
                                        "display": True,
                                        "fontStyle": "",
                                        "fontSize": 10
                                    }
                                    },
                                    "grid": {
                                    "x": False,
                                    "y": True
                                    },
                                    "legend": {
                                    "display": False,
                                    "position": "right"
                                    },
                                    "type": "time"
                                },
                                "update": {
                                    "type": "default",
                                    "duration": 1000
                                },
                                "data": [
                                    {
                                    "dataset": "temp_casq_g{}_right_a".format(i),
                                    "type": "line", "display": True,
                                    "color": "rgb(255,215,0)"
                                    },{
                                    "dataset": "temp_casq_g{}_right_b".format(i),
                                    "type": "line", "display": True,
                                    "color": "rgb(255,48,48)"
                                    },{
                                    "dataset": "temp_casq_g{}_right_c".format(i),
                                    "type": "line", "display": True,
                                    "color": "rgb(64,64,255)"
                                    }
                                ]
                                }
                            ]
                            }
                        ]
                    }
                ]
            }
        )
    # Create Layout
    layout = {
        "layout": [
            {
                "type": "layout",
                "sidenav": {
                    "display": "True"
                },
                "topnav": [],
                "body": {
                    "color": "#f8f9fa",
                    "font": {
                        "color": "#343a40",
                        "size": 1.2
                }
                },
                "content": content
            }
        ]
    }
    # Return Layout
    return layout

#Parse
layout = parse_layout()
json.dump(layout, open("layout.json","w"))