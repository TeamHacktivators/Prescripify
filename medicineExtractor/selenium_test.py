from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.keys import Keys
from selenium.common.exceptions import NoSuchElementException
import chromedriver_autoinstaller

def setup():
    chromedriver_path = chromedriver_autoinstaller.install()
    options = Options()
    options.add_argument("--headless")
    service = Service(chromedriver_path)
    browser = webdriver.Chrome(service=service, options=options)
    browser.maximize_window()
    return browser

def open_website(browser, url):
    browser.get(url)

def find_element_with_fallback(browser, primary_xpath, fallback_xpath):
    try:
        return browser.find_element(By.XPATH, primary_xpath).text
    except NoSuchElementException:
        try:
            return browser.find_element(By.XPATH, fallback_xpath).text
        except NoSuchElementException:
            return None

def extract_product_info_1mg(browser):
    product_name_xpath = "//div[contains(@class,'style__pro-title___')]"
    pack_size_xpath = "//div[contains(@class,'style__pack-size___')]"
    price_xpath = "//div[contains(@class,'style__price-tag___')]"
    mrp_xpath = "//div[contains(@class,'style__discount-price___')]"
    discount_xpath = "//div[contains(@class,'style__off-badge___')]"

    product_name_fallback_xpath = product_name_xpath.replace("//div", "//span")
    pack_size_fallback_xpath = pack_size_xpath.replace("//div", "//span")
    price_fallback_xpath = price_xpath.replace("//div", "//span")
    mrp_fallback_xpath = mrp_xpath.replace("//div", "//span")
    discount_fallback_xpath = discount_xpath.replace("//div", "//span")

    product_name = find_element_with_fallback(browser, product_name_xpath, product_name_fallback_xpath) or "N/A"
    pack_size = find_element_with_fallback(browser, pack_size_xpath, pack_size_fallback_xpath) or "N/A"
    price = find_element_with_fallback(browser, price_xpath, price_fallback_xpath) or "N/A"
    mrp_price = find_element_with_fallback(browser, mrp_xpath, mrp_fallback_xpath) or "N/A"
    discount = find_element_with_fallback(browser, discount_xpath, discount_fallback_xpath) or "0%"

    # print("1mg:")
    # print("Product Name:", product_name)
    # print("Pack Size:", pack_size)
    # print("Price:", price)
    # print("MRP Price:", mrp_price)
    # print("Discount:", discount)

    data = {"Product Name":product_name,"Pack Size":pack_size,"Price":price,"MRP price":mrp_price,"Discount":discount}
    return data

def test_1mg(medicine):
    search_xpath = "//input[@id='srchBarShwInfo']"
    search_icon_xpath = "//span/div[@class='header_search_icon']"
    close_popup_xpath = "//div[@class='style__close-icon___3FflV']"
    browser = setup()
    open_website(browser, "https://www.1mg.com/")
    browser.refresh()
    popup = browser.find_element(By.XPATH,close_popup_xpath)
    popup.click()
    search_bar = browser.find_element(By.XPATH, search_xpath)
    search_bar.send_keys(medicine)
    search_icon = browser.find_element(By.XPATH, search_icon_xpath)
    search_icon.click()

    data = extract_product_info_1mg(browser)
    browser.quit()
    return data

def extract_product_info_apollo(browser):
    name_xpath = "//div[@class='ProductCard_productCardGrid__NHfRH   ']//div[@class='IV   ']//a[@class='cardAnchorStyle']//div[@class='JV']//div[@class='RV']//div[@class='SV']//h2[contains(@class, 'Kd') and contains(@class, 'Id') and contains(@class, 'WV') and contains(@class, 'XV') and contains(@class, 'Wd')]"
    pack_size_xpath = "//div[@class='ProductCard_productCardGrid__NHfRH   ']//div[@class='IV   ']//a[@class='cardAnchorStyle']//div[@class='JV']//div[@class='RV']//div[@class='SV']//h2[contains(@class, 'Kd') and contains(@class, 'Id') and contains(@class, 'WV') and contains(@class, 'Wd') and not(contains(@class,'XV'))]"
    price_xpath = "//div[@class='ProductCard_productCardGrid__NHfRH   ']//div[@class='IV   ']//a[@class='cardAnchorStyle']//div[@class='JV']//div[@class='RV']//div[@class='TV']//div[@class='Tf_  UV']//p[contains(@class, 'Pd') and contains(@class, 'Id') and contains(@class, 'Vf_') and contains(@class, 'VV') and contains(@class, 'Vd')]"
    mrp_xpath = "//div[@class='ProductCard_productCardGrid__NHfRH   ']//div[@class='IV   ']//a[@class='cardAnchorStyle']//div[@class='JV']//div[@class='RV']//div[@class='TV']//div[@class='Tf_  UV']//p[contains(@class, 'Pd') and contains(@class, 'Id') and contains(@class, 'af') and not(contains(@class, 'Vf_'))]//span[contains(@class, 'Wf_')]"
    discount_xpath = "//div[@class='ProductCard_productCardGrid__NHfRH   ']//div[@class='IV   ']//a[@class='cardAnchorStyle']//div[@class='JV']//div[@class='RV']//div[@class='TV']//div[@class='Tf_  UV']//p[contains(@class, 'Pd') and contains(@class, 'Id') and contains(@class, 'Xf_')]"

    try:
        medicine_names = WebDriverWait(browser, 10).until(
            EC.presence_of_all_elements_located((By.XPATH, name_xpath))
        )
        medicine_packs = WebDriverWait(browser, 10).until(
            EC.presence_of_all_elements_located((By.XPATH, pack_size_xpath))
        )
        medicine_prices = WebDriverWait(browser, 10).until(
            EC.presence_of_all_elements_located((By.XPATH, price_xpath))
        )
        medicine_mrps = WebDriverWait(browser, 10).until(
            EC.presence_of_all_elements_located((By.XPATH, mrp_xpath))
        )
        medicine_discounts = WebDriverWait(browser, 10).until(
            EC.presence_of_all_elements_located((By.XPATH, discount_xpath))
        )
        medicine_name = medicine_names[0].text
        pack_size = medicine_packs[0].text
        price = medicine_prices[0].text
        mrp = medicine_mrps[0].text
        discount = medicine_discounts[0].text

        # print("Apollo:")
        # print(f"Product Name: {medicine_name if medicine_name else 'N/A'}")
        # print(f"Pack Size: {pack_size if pack_size else 'N/A'}")
        # print(f"Price: {price if price else 'N/A'}")
        # print(f"MRP Price: {mrp[1:-1] if mrp else 'N/A'}")
        # print(f"Discount: {discount if discount else 'N/A'}")

        data = {"Product Name": medicine_name, "Pack Size": pack_size, "Price": price, "MRP price": mrp,
                "Discount": discount}
        return data


    except NoSuchElementException as e:
        print("Error extracting data from Apollo:", e)


def test_apollo(medicine):
    search_box_xpath = "//div[@class='Home_searchSelectMain__VL1lN']"
    search_input_xpath = "//input[@id='searchProduct' and @placeholder='Search medicines, brands and more']"
    browser = setup()
    open_website(browser, "https://www.apollopharmacy.in/")

    search_box = browser.find_element(By.XPATH, search_box_xpath)
    search_box.click()
    search_input = browser.find_element(By.XPATH, search_input_xpath)
    search_input.send_keys(medicine)
    search_input.send_keys(Keys.ENTER)

    data = extract_product_info_apollo(browser)
    browser.quit()
    return data

def extract_product_info_pharmeasy(browser):
    medicine_name_xpath = "//div[@class='ProductCard_nameLogoContainer__lfDsP']//h1"
    pack_size_xpath = "//div[@class='ProductCard_measurementUnit__hsZ2o']"
    price_xpath = "//div[@class='ProductCard_ourPrice__yDytt']"
    mrp_xpath = "//div[@class='ProductCard_originalMrp__cDqTo']//span"
    discount_xpath = "//div[@class='ProductCard_priceDiscountWrapper__UbAup']//span[contains(@class,'ProductCard_discount')]"

    try:

        medicine_names = WebDriverWait(browser, 10).until(
            EC.presence_of_all_elements_located((By.XPATH, medicine_name_xpath))
        )
        medicine_packs = WebDriverWait(browser, 10).until(
            EC.presence_of_all_elements_located((By.XPATH, pack_size_xpath))
        )
        medicine_prices = WebDriverWait(browser, 10).until(
            EC.presence_of_all_elements_located((By.XPATH, price_xpath))
        )
        medicine_mrps = WebDriverWait(browser, 10).until(
            EC.presence_of_all_elements_located((By.XPATH, mrp_xpath))
        )
        medicine_discounts = WebDriverWait(browser, 10).until(
            EC.presence_of_all_elements_located((By.XPATH, discount_xpath))
        )
        medicine_name = medicine_names[0].text
        pack_size = medicine_packs[0].text
        price = medicine_prices[0].text
        mrp = medicine_mrps[0].text
        discount = medicine_discounts[0].text

        # print("Pharmeasy:")
        # print(f"Product Name: {medicine_name if medicine_name else 'N/A'}")
        # print(f"Pack Size: {pack_size if pack_size else 'N/A'}")
        # print(f"Price: {price if price else 'N/A'}")
        # print(f"MRP Price ₹: {mrp[1:-1] if mrp else 'N/A'}")
        # print(f"Discount: {discount if discount else 'N/A'}")

        data = {"Product Name": medicine_name, "Pack Size": pack_size, "Price": price, "MRP price": mrp,
                "Discount": discount}
        return data

    except NoSuchElementException as e:
        print("Error extracting data from Apollo:", e)
def test_pharmeasy(medicine):
    search_input_xpath = "//div[@class='c-PJLV c-bXbWpx c-bXbWpx-lfylVv-direction-row c-bXbWpx-DytHV-justify-between c-bXbWpx-joJbDg-align-center c-bXbWpx-ikchDsf-css']//input"
    search_button_xpath = "//div[@class='c-PJLV c-bXbWpx c-bXbWpx-joLzpF-justify-center c-bXbWpx-joJbDg-align-center c-bXbWpx-igKcZLf-css']"
    browser = setup()
    open_website(browser,"https://pharmeasy.in/")
    search_button = browser.find_element(By.XPATH,search_button_xpath)
    search_button.click()
    search_box = browser.find_element(By.XPATH,search_input_xpath)
    search_box.send_keys(medicine)
    search_box.send_keys(Keys.ENTER)
    data = extract_product_info_pharmeasy(browser)
    browser.quit()
    return data

def get_all(medicine):
    test_apollo(medicine)
    print()
    test_1mg(medicine)
    print()
    test_pharmeasy(medicine)



