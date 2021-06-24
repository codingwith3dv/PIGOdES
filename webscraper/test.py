import pymongo
from pymongo import MongoClient
import bs4 as bs
import urllib.request


cluster = MongoClient("mongodb+srv://MNW:bakedpotatoes@cluster0.i8y7n.mongodb.net/myFirstDatabase?retryWrites=true&w=majority")

sauce = urllib.request.urlopen(
    'https://en.wikipedia.org/wiki/List_of_star_systems_within_25%E2%80%9330_light-years').read()
soup = bs.BeautifulSoup(sauce, 'lxml')
db = cluster["starproject"]
colection = db["star"]

nav = soup.nav
kind = 0



name = ''
dis = ''
num = ''
st=''
am=''
comment = ''


for td in soup.find_all('td'):
    if kind >= 6:
        kind = 1
    else:
        kind = kind + 1

    if kind == 1:
        name = td.text
    if kind == 2:
        dis = td.text
    if kind == 3:
        num = td.text
    if kind == 4:
        st = td.text
    if kind == 5:
        am = td.text
    if kind == 6:
        comment = td.text
        colection.insert_one({"name": name, "distance": dis, "number of stars": num, "spectral type": st, "apparent magnitude": am, "comments": comment})
    


   
