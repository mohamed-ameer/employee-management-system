import logging
import json
from django.conf import settings
from django.utils.deprecation import MiddlewareMixin

logger = logging.getLogger('base')

class LoggingMiddleware(MiddlewareMixin):
    def __init__(self, get_response):
        super().__init__(get_response)
        self.get_response = get_response

    def process_request(self, request):
        # Log the request
        if not any(path in request.path for path in ['/static/', '/media/', '/admin/jsi18n/']):
            self._log_request(request)
        return None

    def process_response(self, request, response):
        # Log the response
        if not any(path in request.path for path in ['/static/', '/media/', '/admin/jsi18n/']):
            self._log_response(request, response)
        return response

    def _log_request(self, request):
        # Clean sensitive data from request
        clean_data = self._clean_data(request.POST.copy())
        
        log_data = {
            'method': request.method,
            'path': request.path,
            'user': str(request.user),
            'data': clean_data
        }
        
        logger.info(f"Request: {json.dumps(log_data)}")

    def _log_response(self, request, response):
        # Only log responses that indicate an error
        if 400 <= response.status_code < 600:
            log_data = {
                'method': request.method,
                'path': request.path,
                'status_code': response.status_code,
                'user': str(request.user),
            }
            
            logger.error(f"Response Error: {json.dumps(log_data)}")
        elif response.status_code == 201:
            logger.info(f"Created: {request.path} by {request.user}")

    def _clean_data(self, data):
        """Remove sensitive information from the data"""
        if isinstance(data, dict):
            for field in settings.LOGGING_SENSITIVE_FIELDS:
                if field in data:
                    data[field] = '[FILTERED]'
        return data
