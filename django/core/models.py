from core.helpers.alert import alerta
from rest_framework.pagination import PageNumberPagination

class CustomSetPagination(PageNumberPagination):
    page_size = 1000
    page_size_query_param = 'page_size'
    max_page_size = 10000

    def get_page_size(self, request):
        try:
            page_size = int(request.query_params.get('page_size', self.page_size))
            if page_size == -1:
                page_size = 2000
      
            return min(page_size, self.max_page_size)
        except ValueError:
            raise alerta(errors=["Invalid page_size query parameter"])