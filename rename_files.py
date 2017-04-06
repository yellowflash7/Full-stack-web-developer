import os
def rename_files:
    file_list=os.listdir("c:\\files\images")
    for file_name in file_list:
	    os.rename(file_name,file_name.translate(none,"0123456789"))
rename_files()