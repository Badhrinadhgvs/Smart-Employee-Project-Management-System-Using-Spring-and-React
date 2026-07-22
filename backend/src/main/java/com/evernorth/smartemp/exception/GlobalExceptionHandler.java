package com.evernorth.smartemp.exception;
import org.springframework.http.*; import org.springframework.security.core.AuthenticationException; import org.springframework.web.bind.MethodArgumentNotValidException; import org.springframework.web.bind.annotation.*; import java.time.Instant; import java.util.Map;
@RestControllerAdvice public class GlobalExceptionHandler {
 private ResponseEntity<Map<String,Object>> body(HttpStatus s,String m){return ResponseEntity.status(s).body(Map.of("timestamp", Instant.now(),"status",s.value(),"message",m));}
 @ExceptionHandler(ResourceNotFoundException.class) ResponseEntity<?> notFound(ResourceNotFoundException e){return body(HttpStatus.NOT_FOUND,e.getMessage());}
 @ExceptionHandler(BadRequestException.class) ResponseEntity<?> bad(BadRequestException e){return body(HttpStatus.BAD_REQUEST,e.getMessage());}
 @ExceptionHandler(AuthenticationException.class) ResponseEntity<?> auth(AuthenticationException e){return body(HttpStatus.UNAUTHORIZED,"Invalid username or password");}
 @ExceptionHandler(MethodArgumentNotValidException.class) ResponseEntity<?> validation(MethodArgumentNotValidException e){String m=e.getBindingResult().getFieldErrors().stream().findFirst().map(x->x.getDefaultMessage()).orElse("Validation failed");return body(HttpStatus.BAD_REQUEST,m);}
 @ExceptionHandler(Exception.class) ResponseEntity<?> generic(Exception e){return body(HttpStatus.INTERNAL_SERVER_ERROR,"Internal server error");}
}
