from apscheduler.schedulers.background import BackgroundScheduler
from .models import *
import pandas as pd

def StartProdutoScheduler():
    scheduler = BackgroundScheduler()
    scheduler.remove_all_jobs()
    scheduler.add_job(ProdutoJob, 'interval', seconds=2)
    scheduler.start()

def ProdutoJob():
    print('Running produto Job...')
    produtos = ProductFiles.objects.filter(fileRead=False)
    for produto in produtos:
        file = pd.read_excel(produto.file.path)
        for index, row in file.iterrows():
            if row['Name'] is not None and row['categoryFK'] is not None and row['weight'] is not None and row['description'] is not None and row['barCode'] is not None and row['image'] is not None:
                category = ProductCategory.objects.get(name=row['categoryFK'])
                Product.objects.create(
                    name=row['Name'],
                    categoryFK=category,
                    weight=row['weight'],
                    description=row['description'],
                    barCode=row['barCode'],
                    image=row['image']
                )
        produto.fileRead = True
        produto.save()


