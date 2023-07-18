package flow.logsmerger.business.logic.config.validator;

import flow.logsmerger.business.logic.utils.Utils;
import flow.logsmerger.business.logic.query.broker.QueryTimestamps;

import javax.validation.Constraint;
import javax.validation.Payload;
import java.lang.annotation.Documented;
import java.lang.annotation.Retention;
import java.lang.annotation.Target;

import static java.lang.annotation.ElementType.FIELD;
import static java.lang.annotation.RetentionPolicy.RUNTIME;

@Target({FIELD})
@Retention(RUNTIME)
@Documented
@Constraint(validatedBy = TimestampsValidator.class)
public @interface TimestampsEnumValue {
    Class<? extends Enum<QueryTimestamps>> enumClass();
    String message() default Utils.ERROR_SEARCH_RANGE_VALIDATION;
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}
