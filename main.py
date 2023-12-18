import pandas as pd

def subtotals(pt,df,row,col,value):
    temp = pt.to_dict(orient='split')
    index_ = temp['index']
    data_ = temp['data']
    column = temp['columns']
    res_index = []
    res_data = []
    curr_idx=0
    mod = len(index_[0])-1    
    for i in range (mod):
        lst = list(index_[curr_idx][:i+1])
        data = []
        mask = pd.Series(True, index=df.index)
        for j in range (len(lst)):
            mask &= (df[row[j]]==lst[j])
        for j in range (len(column)):
            temp = mask&(df[col[0]]==column[j])
            data.append(df.loc[temp,value].sum())
        data[-1]=(df.loc[mask,value].sum())
        res_index.append(index_[i][:i+1]+('',)*(mod-len(index_[i][:i+1])+1))
        res_data.append(data)
    
    res_index.append(index_[curr_idx])
    res_data.append(data_[0]) 
        
    while curr_idx<(len(data_)-2):
        for i in range (mod):
            if index_[curr_idx][i]==index_[curr_idx+1][i]:
                pass
            else:
                lst = list(index_[curr_idx+1][:i+1])
                data = []
                mask = pd.Series(True, index=df.index)
                for j in range (len(lst)):
                    mask &= (df[row[j]]==lst[j])
                for j in range (len(column)):
                    temp = mask&(df[col[0]]==column[j])
                    data.append(df.loc[temp,value].sum())
                res_index.append((index_[curr_idx+1][:i+1]+('',)*(mod-len(index_[curr_idx+1][:i+1])+1)))
                res_data.append(data)
        res_index.append(index_[curr_idx+1])
        res_data.append(data_[curr_idx+1])
        curr_idx+=1
    res_index.append(index_[-1])
    res_data.append(data_[-1])
    return {'columns':column ,'data':res_data ,'index':res_index, 'rows':row,'allcolumns':df.columns.tolist()}
