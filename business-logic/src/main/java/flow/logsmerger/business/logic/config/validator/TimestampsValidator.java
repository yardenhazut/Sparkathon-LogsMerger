package flow.logsmerger.business.logic.config.validator;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;

public class TimestampsValidator implements ConstraintValidator<TimestampsEnumValue, CharSequence> {
    private Set<String> acceptedValues;

    @Override
    public void initialize(TimestampsEnumValue annotation) {
        acceptedValues = Stream.of(annotation.enumClass().getEnumConstants())
                .map(Enum::name)
                .collect(Collectors.toSet());
    }

    @Override
    public boolean isValid(CharSequence value, ConstraintValidatorContext context) {
        return value != null && acceptedValues.contains(value.toString().toUpperCase());
    }
}
