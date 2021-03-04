import pandas as pd
import csv
import json

dtype_year = {"Year": str} # adds .0 to year otherwise
temp_data = pd.read_csv("./data/FAOSTAT_temp.csv", encoding="latin1", dtype=dtype_year)
country_data = pd.read_csv("./data/FAOSTAT_ISO_3.csv", converters={'M49 Code': lambda x: str(x)})

# Drop unwanted cols in temp_data 
temp_data.drop(["ï»¿Domain Code", "Domain", "Area Code", "Element Code", "Element", "Months Code", "Months", "Year Code", "Unit", "Flag", "Flag Description"], axis=1, inplace=True) 
temp_data.rename(columns = {"Area":"country_name", "Year": "year", "Value": "value"}, inplace = True)

# Drop unwanted cols in country_data
country_data.drop(["Country Code", "ISO2 Code", "Start Year", "End Year"], axis=1, inplace=True) 
country_data.rename(columns = {"Country": "country_name", "M49 Code": "country_code", "ISO3 Code": "iso3_code"}, inplace=True)

# Merge temp_data and country_data
data = pd.merge(temp_data, country_data, how="outer", on="country_name")
#print(f"data: {data.head(60)}")

# TO JSON:
# data = data.to_json()
# with open('/.data/temp_data.json', 'w', encoding='utf8') as json_file:
#     json.dump(data, json_file, ensure_ascii=False)

# TO CSV
with open('./data/temp_data.csv', 'w', newline='') as csvfile:
    df = pd.DataFrame(data)
    df.to_csv('./data/temp_data.csv', index=False)